"use client";

import * as React from "react";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "../../../registry/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../registry/ui/card";
import { Spotlight } from "../../../registry/ui/spotlight";
import { DotGrid } from "../../../registry/ui/dot-grid";
import { Marquee } from "../../../registry/ui/marquee";
import { usePageVisible } from "@/lib/use-page-visible";

const TILES = [
  {
    name: "button.tsx",
    href: "/components/button",
    body: (
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm">Default</Button>
        <Button size="sm" variant="secondary">
          Secondary
        </Button>
        <Button size="sm" variant="outline">
          Outline
        </Button>
      </div>
    ),
  },
  {
    name: "card.tsx",
    href: "/components/card",
    body: (
      <Card className="border-border/70">
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-xs">Create project</CardTitle>
          <CardDescription className="text-xs">
            Deploy in one click.
          </CardDescription>
        </CardHeader>
        <CardFooter className="gap-1.5 p-3 pt-1">
          <Button size="sm">Deploy</Button>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    name: "dot-grid.tsx",
    href: "/components/dot-grid",
    body: (
      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-lg border border-border/60">
        <DotGrid mask="none" />
        <span className="relative rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
          Backgrounds
        </span>
      </div>
    ),
  },
  {
    name: "spotlight.tsx",
    href: "/components/spotlight",
    body: (
      <Spotlight
        intensity={0.3}
        className="flex h-28 items-center justify-center rounded-lg border border-border/60"
      >
        <p className="text-xs font-medium">Hover for glow</p>
      </Spotlight>
    ),
  },
  {
    name: "marquee.tsx",
    href: "/components/marquee",
    body: (
      <Marquee duration={18}>
        {["Buttons", "Cards", "Themes", "MCP", "CLI"].map((t) => (
          <span
            key={t}
            className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </Marquee>
    ),
  },
  {
    name: "sizes.tsx",
    href: "/components/button",
    body: (
      <div className="flex flex-wrap items-center gap-1.5">
        <Button size="sm">Small</Button>
        <Button size="sm">Default</Button>
        <Button size="sm">Large</Button>
      </div>
    ),
  },
];

const DWELL = 4600;
const SWAP = 560;

/**
 * Camera dive: a fixed stage shows every component, then the camera
 * glides into one at a time - in, hold, ease back, dive into the
 * next unseen card. Cards link to their docs, dots jump, and the
 * tour can be paused. Still under reduced motion.
 */
export function HeroCollage({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const visible = usePageVisible();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [shot, setShot] = React.useState({ x: 0, y: 0, scale: 1 });
  const [origin, setOrigin] = React.useState("center");
  const [phase, setPhase] = React.useState<"out" | "in">("in");
  // Deck lives in a ref so hovering never resets a round mid-deal.
  const bagRef = React.useRef<number[]>([]);
  const lastRef = React.useRef(-1);
  const paused = userPaused || hovering || !visible;

  // Deal every card once in random order, then reshuffle. The round
  // boundary never repeats the last card.
  const draw = React.useCallback(() => {
    if (bagRef.current.length === 0) {
      const deck = TILES.map((_, i) => i);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      if (deck[0] === lastRef.current) deck.push(deck.shift() as number);
      bagRef.current.push(...deck);
    }
    const n = bagRef.current.shift() as number;
    lastRef.current = n;
    return n;
  }, []);

  const frameShot = React.useCallback((index: number) => {
    const stage = stageRef.current;
    const card = cardRefs.current[index];
    if (!stage || !card) return;
    // offsetLeft/Top ignore transforms, so the math holds no matter
    // where the camera currently sits.
    const sw = stage.offsetWidth;
    const sh = stage.offsetHeight;
    const cx = card.offsetLeft + card.offsetWidth / 2;
    const cy = card.offsetTop + card.offsetHeight / 2;
    const scale = Math.min(
      sw / (card.offsetWidth + 24),
      sh / (card.offsetHeight + 24),
      1.9
    );
    setShot({ x: sw / 2 - cx, y: sh / 2 - cy, scale });
    // Zoom around the card itself so it lands dead-center at any scale.
    setOrigin(`${cx}px ${cy}px`);
    setActive(index);
  }, []);

  // Jump to a specific card and mark it seen so the tour skips it.
  const goTo = React.useCallback(
    (index: number) => {
      bagRef.current = bagRef.current.filter((i) => i !== index);
      lastRef.current = index;
      setPhase("in");
      frameShot(index);
    },
    [frameShot]
  );

  React.useEffect(() => {
    if (reduceMotion || paused) return;
    let dive: ReturnType<typeof setTimeout> | undefined;
    setPhase("in");
    frameShot(draw());
    const t = setInterval(() => {
      // Deal the next unseen card, then move: ease back, hold, dive.
      const n = draw();
      setPhase("out");
      setOrigin("center");
      setShot({ x: 0, y: 0, scale: 1.18 });
      dive = setTimeout(() => {
        setPhase("in");
        frameShot(n);
      }, SWAP);
    }, DWELL);
    return () => {
      clearInterval(t);
      clearTimeout(dive);
    };
  }, [reduceMotion, paused, frameShot, draw]);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn("w-full", className)}
    >
      <div
        ref={stageRef}
        className="relative h-105 overflow-hidden rounded-3xl bg-muted sm:h-135 dark:bg-card"
      >
        <motion.div
          animate={reduceMotion ? { x: 0, y: 0, scale: 1 } : shot}
          transition={
            phase === "out"
              ? { type: "spring", stiffness: 120, damping: 22, mass: 0.8 }
              : { type: "spring", stiffness: 38, damping: 24, mass: 1.1 }
          }
          style={{ transformOrigin: origin, willChange: "transform" }}
          className="relative grid h-full w-full grid-cols-3 content-start gap-3 p-5"
        >
          {TILES.map((t, i) => (
            <Link
              key={t.name}
              href={t.href}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "overflow-hidden rounded-xl border bg-background transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                !reduceMotion && active === i
                  ? "border-brand/70 shadow-lg"
                  : "border-border/70 hover:border-muted-foreground/50"
              )}
            >
              <p className="border-b border-border/70 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                {t.name}
              </p>
              <div className="pointer-events-none p-3">{t.body}</div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        {TILES.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Focus ${t.name}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === active
                ? "w-5 bg-brand"
                : "w-1.5 bg-border hover:bg-muted-foreground"
            )}
          />
        ))}
        {!reduceMotion && (
          <button
            type="button"
            aria-label={userPaused ? "Resume tour" : "Pause tour"}
            onClick={() => setUserPaused((p) => !p)}
            className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {userPaused ? (
              <Play className="size-3" />
            ) : (
              <Pause className="size-3" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
