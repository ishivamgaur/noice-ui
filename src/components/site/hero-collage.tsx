"use client";

import * as React from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { zoom } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { usePageVisible } from "@/lib/use-page-visible";
import { components } from "@/lib/registry";
import { DEMOS } from "@/components/demos/demos";

/**
 * Every registry component, in catalog order, as one cell. A new entry
 * joins the canvas on the next build with no edit here. Each cell takes
 * the component's own width and height, so nothing is stretched into a
 * uniform box or rescaled to fit one.
 */
const TILES = components.map((c) => {
  const Demo = DEMOS[c.name];
  return {
    name: `${c.name}.tsx`,
    href: `/components/${c.name}`,
    body: Demo ? <Demo /> : null,
  };
});

const DWELL = 4200;
/** How long the whole canvas is held before the camera dives in. */
const OUT_HOLD = 1100;
/** Delay before the very first dive, so the opening wide shot lands. */
const FIRST_DELAY = 1200;


/**
 * Camera dive: the stage zooms and pans as one layer, so the whole
 * wall of components rushes toward the viewer and settles on the
 * focused card. Every move eases back to a wider view first, then
 * dives into the next card the deck deals. Links, dots, and a pause
 * control make it explorable, and it freezes on hidden tabs.
 */
export function HeroCollage({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const visible = usePageVisible();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const boardRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [shot, setShot] = React.useState({ x: 0, y: 0, scale: 1 });
  const [phase, setPhase] = React.useState<"out" | "in">("in");
  // Deck lives in a ref so hovering never resets a round mid-deal.
  const bagRef = React.useRef<number[]>([]);
  // Card already dealt but not yet framed. Kept so pausing mid-move
  // resumes the same card instead of dropping it from the round.
  // Mirrors `active` so a pause can re-frame the same card.
  const activeRef = React.useRef(0);
  // The cursor has no influence on the camera at all. No hover, no
  // proximity, no parallax: the tour runs on its own clock and only the
  // pause control or a hidden tab stops it. Letting the pointer steer
  // the zoom fed back on itself, since panning slides new tiles under
  // the cursor and retriggers whatever the cursor was doing.
  const paused = userPaused || !visible;

  // Deal every card once in random order, then reshuffle. The round
  // boundary never hands back the card already on stage.
  const draw = React.useCallback(() => {
    if (bagRef.current.length === 0) {
      const deck = TILES.map((_, i) => i);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (deck[0] === activeRef.current) deck.push(deck.shift() as number);
      bagRef.current.push(...deck);
    }
    let n = bagRef.current.shift() as number;
    // Belt and braces: never deal what is already focused.
    if (n === activeRef.current && bagRef.current.length > 0) {
      bagRef.current.push(n);
      n = bagRef.current.shift() as number;
    }
    return n;
  }, []);

  // The board is a large canvas; the stage is only the viewport onto it.
  // The pull-back shows a readable sheet of the canvas rather than the
  // whole thing: zooming all the way out to fit every component made them
  // unreadable, so the scale is floored and the camera pans instead.
  const overviewShot = React.useCallback(() => {
    const stage = stageRef.current;
    const board = boardRef.current;
    if (!stage || !board) return { x: 0, y: 0, scale: 1 };
    const sw = stage.offsetWidth;
    const sh = stage.offsetHeight;
    const bw = board.offsetWidth;
    const bh = board.offsetHeight;
    // The board scales about its own centre, so centring it means putting
    // that centre on the stage centre. The scale is floored so the
    // pull-back never shrinks far enough to make the components
    // unreadable; past that point the camera pans across the canvas.
    const scale = Math.max(0.72, Math.min(sw / bw, sh / bh, 1));
    return {
      x: sw / 2 - (board.offsetLeft + bw / 2),
      y: sh / 2 - (board.offsetTop + bh / 2),
      scale,
    };
  }, []);

  const frameShot = React.useCallback((index: number) => {
    const stage = stageRef.current;
    const board = boardRef.current;
    const card = cardRefs.current[index];
    if (!stage || !board || !card) return;
    // offsetLeft/Top ignore transforms, so the math holds no matter
    // where the camera currently sits.
    const sw = stage.offsetWidth;
    const sh = stage.offsetHeight;
    const bw = board.offsetWidth;
    const bh = board.offsetHeight;
    // Card centre in board-local space, and the board centre in stage
    // space. The transform runs about the board centre, so both are
    // needed: scaling about the stage centre instead only lines up when
    // scale is exactly 1, which is why every zoomed dive drifted.
    const cx = card.offsetLeft + card.offsetWidth / 2;
    const cy = card.offsetTop + card.offsetHeight / 2;
    const bx = board.offsetLeft + bw / 2;
    const by = board.offsetTop + bh / 2;
    const scale = Math.min(
      sw / (card.offsetWidth + 24),
      sh / (card.offsetHeight + 24),
      1.6
    );
    setShot({
      x: sw / 2 - bx - scale * (cx - bw / 2),
      y: sh / 2 - by - scale * (cy - bh / 2),
      scale,
    });
    activeRef.current = index;
    setActive(index);
  }, []);

  // Every move is one camera language: pull back to the whole canvas,
  // hold there, dive onto a card, hold on it, repeat. Timings are a
  // chain of waits rather than an interval, so each leg gets its full
  // time and the two holds cannot overlap or be cut short.
  const timers = React.useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const clearTimers = React.useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const wait = React.useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        timers.current.push(setTimeout(resolve, ms));
      }),
    []
  );

  React.useEffect(() => {
    if (reduceMotion || paused) {
      // Stop dead rather than finishing a move nobody is watching. The
      // camera settles on whatever is focused, so pausing never leaves a
      // half-finished pan on screen. Deferred a frame so this is not a
      // synchronous state write inside the effect.
      clearTimers();
      const settle = requestAnimationFrame(() => {
        setPhase("in");
        frameShot(activeRef.current);
      });
      return () => cancelAnimationFrame(settle);
    }

    let cancelled = false;
    (async () => {
      await wait(FIRST_DELAY);
      // Loop until a pause clears the timers, which rejects the awaits by
      // never resolving and lets this task fall out on its own.
      while (!cancelled) {
        setPhase("out");
        setShot(overviewShot());
        await wait(OUT_HOLD);
        if (cancelled) return;

        const n = draw();
        setPhase("in");
        frameShot(n);
        await wait(DWELL);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [
    reduceMotion,
    paused,
    frameShot,
    draw,
    overviewShot,
    wait,
    clearTimers,
  ]);

  return (
    <motion.div
      initial={reduceMotion ? false : zoom.hidden}
      animate={zoom.shown}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 210, damping: 26, delay: 0.34 }
      }
      // min-w-0 stops the wide board from stretching the hero's grid
      // column; the stage clips it instead.
      className={cn("w-full min-w-0", className)}
    >
      {/* The board fills its frame and the camera walks it one component
          at a time. Each cell clips its own content so the grid stays
          clean, but nothing inside is rescaled or restyled to fit. */}
      <div
        ref={stageRef}
        className="relative h-105 overflow-hidden rounded-lg bg-background shadow-inset-well sm:h-135"
      >
        <motion.div
          ref={boardRef}
          animate={reduceMotion ? { x: 0, y: 0, scale: 1 } : shot}
          transition={
            // Pulling back is unhurried, diving in is a touch brisker.
            // Both are damped close to critical so the camera arrives and
            // stops rather than rocking on the spot.
            phase === "out"
              ? { type: "spring", stiffness: 42, damping: 26, mass: 1 }
              : { type: "spring", stiffness: 58, damping: 28, mass: 1 }
          }
          style={{ transformOrigin: "center", willChange: "transform" }}
          // A canvas holding every component at its own size. Cells wrap
          // rather than sit in fixed tracks, so the mosaic takes the shape
          // each component actually needs. The stage is the viewport.
          className="relative flex w-[1180px] flex-wrap content-start items-start gap-3 p-4 sm:gap-4 sm:p-5"
        >
          {TILES.map((t, i) => (
            // A live sandbox, not a link. Wrapping the cell in an anchor
            // made every click land on navigation instead of on the
            // component underneath, so nothing here could be tried out.
            // Navigation lives on the filename instead.
            <div
              key={t.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="flex min-h-44 min-w-72 w-fit shrink-0 flex-col rounded-lg p-0.5"
            >
              <div
                className={cn(
                  "flex min-h-43 min-w-71 flex-1 flex-col overflow-hidden rounded-md border border-transparent bg-background transition-shadow duration-500",
                  // Every card is a neumorphic surface: one light source
                  // up and to the left, one shadow down and to the right,
                  // both at the same 3px offset and 7px blur so the relief
                  // reads as consistent lighting across the whole board
                  // rather than a per-card effect. The focused card is the
                  // same construction pressed inward, so changing focus is
                  // a change of relief and nothing else. No brand tint.
                  !reduceMotion && active === i
                    ? "shadow-[inset_3px_3px_7px_oklch(0_0_0/0.07),inset_-3px_-3px_7px_oklch(1_0_0/0.75)] dark:shadow-[inset_3px_3px_7px_oklch(0_0_0/0.6),inset_-3px_-3px_7px_oklch(1_0_0/0.07)]"
                    : "shadow-[3px_3px_7px_oklch(0_0_0/0.07),-3px_-3px_7px_oklch(1_0_0/0.75)] dark:shadow-[3px_3px_7px_oklch(0_0_0/0.6),-3px_-3px_7px_oklch(1_0_0/0.07)]"
                )}
              >
                <p
                  className={cn(
                    "shrink-0 truncate border-b px-2.5 py-1 font-mono text-[10px] leading-4 transition-colors",
                    !reduceMotion && active === i
                      ? "border-border/70"
                      : "border-border/40"
                  )}
                >
                  {/* The one place a cell navigates. The body below stays
                      entirely free for the component's own controls. */}
                  <Link
                    href={t.href}
                    className={cn(
                      "block truncate outline-none transition-colors hover:text-foreground focus-visible:underline",
                      !reduceMotion && active === i
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {t.name}
                  </Link>
                </p>
                <div className="flex flex-1 items-center justify-center p-3">
                  {t.body}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pause lives in the corner rather than a row of dots: the tour
            still has to be stoppable, but it should not lay out a
            pagination strip under the board. */}
        {!reduceMotion && (
          <button
            type="button"
            aria-label={userPaused ? "Resume tour" : "Pause tour"}
            onClick={() => setUserPaused((p) => !p)}
            className="absolute right-3 bottom-3 z-10 flex size-7 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {userPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
