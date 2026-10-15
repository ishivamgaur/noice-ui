"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Soft travel spring for the flap. Kept local so this file ships standalone. */
const FLAP_SPRING = { type: "spring", stiffness: 200, damping: 28 } as const;

export const FOLDER_COLORS = ["frost", "ocean", "rose", "noir", "mustard"] as const;
export type FolderColor = (typeof FOLDER_COLORS)[number];

/** Representative dot color per tint, for building swatch pickers. */
export const FOLDER_SWATCHES: Record<FolderColor, string> = {
  frost: "#dfe5ea",
  ocean: "#55aaff",
  rose: "#c14a68",
  noir: "#2b2b30",
  mustard: "#f6c800",
};

const PALETTE: Record<
  FolderColor,
  { back: string; front: string; edge: string; paper: string; line: string; swatch: string }
> = {
  frost: {
    back: "rgba(255, 255, 255, 0.14)",
    front: "rgba(255, 255, 255, 0.24)",
    edge: "rgba(255, 255, 255, 0.38)",
    paper: "#f4f4f4",
    line: "#d4d4d4",
    swatch: "#dfe5ea",
  },
  ocean: {
    back: "rgba(56, 150, 255, 0.20)",
    front: "rgba(120, 195, 255, 0.30)",
    edge: "rgba(165, 215, 255, 0.55)",
    paper: "#f4f4f4",
    line: "#cfd8e3",
    swatch: "#55aaff",
  },
  rose: {
    back: "rgba(143, 31, 64, 0.30)",
    front: "rgba(198, 74, 104, 0.34)",
    edge: "rgba(255, 165, 185, 0.55)",
    paper: "#f6f1f2",
    line: "#dcc3cb",
    swatch: "#c14a68",
  },
  noir: {
    back: "rgba(18, 18, 22, 0.55)",
    front: "rgba(48, 48, 55, 0.62)",
    edge: "rgba(255, 255, 255, 0.20)",
    paper: "#f4f4f4",
    line: "#d4d4d4",
    swatch: "#2b2b30",
  },
  mustard: {
    back: "rgba(246, 200, 0, 0.28)",
    front: "rgba(250, 210, 60, 0.32)",
    edge: "rgba(255, 225, 130, 0.55)",
    paper: "#f7f3e8",
    line: "#ddd0b3",
    swatch: "#f6c800",
  },
};

const DIMS: Record<NonNullable<FolderProps["size"]>, { w: number; h: number }> = {
  sm: { w: 190, h: 138 },
  md: { w: 250, h: 182 },
  lg: { w: 310, h: 226 },
};

/** Build a glass palette from any hex: tinted shells, warm paper. */
function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const n = parseInt(full.slice(0, 6), 16);
  if (Number.isNaN(n)) return `rgba(128, 128, 128, ${alpha})`;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Fine film grain for the glass: fractal noise at low opacity, blended
    over the frost so the shells read as textured glass, not flat blur. */
const GRAIN =
  "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/><feColorMatrix type=\"saturate\" values=\"0\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.55\"/></svg>')";

const R = 16;

/**
 * Back shell silhouette: body with a wide flush-left tab rising above
 * the top edge, the tab flowing into the edge with a concave fillet.
 * Box is w × (h + tabH); the body occupies the bottom h.
 */
function backPath(w: number, h: number) {
  const th = Math.round(h * 0.12);
  const H = h + th;
  const tabW = Math.round(w * 0.42);
  return [
    `M ${R} 0`,
    `H ${tabW - 10} C ${tabW - 3} 0 ${tabW} 3 ${tabW} 10`,
    `V ${th - 8} C ${tabW} ${th - 3} ${tabW + 3} ${th} ${tabW + 8} ${th}`,
    `H ${w - R} Q ${w} ${th} ${w} ${th + R}`,
    `V ${H - R} Q ${w} ${H} ${w - R} ${H}`,
    `H ${R} Q 0 ${H} 0 ${H - R}`,
    `V ${R} Q 0 0 ${R} 0 Z`,
  ].join(" ");
}

/**
 * Front flap silhouette: a wide smooth notch — the top edge runs
 * flat, curves down to a flat bottom, and climbs back out on matching
 * curves, so papers show through the cutout.
 */
function frontPath(w: number, h: number) {
  const d = Math.round(h * 0.07);
  const s0 = Math.round(w * 0.16);
  const m0 = Math.round(w * 0.3);
  const m1 = Math.round(w * 0.7);
  const s2 = Math.round(w * 0.84);
  return [
    `M ${R} 0`,
    `H ${s0} C ${s0 + 10} 0 ${s0 + 14} ${d} ${m0} ${d}`,
    `H ${m1} C ${s2 - 14} ${d} ${s2 - 10} 0 ${s2} 0`,
    `H ${w - R} Q ${w} 0 ${w} ${R}`,
    `V ${h - R} Q ${w} ${h} ${w - R} ${h}`,
    `H ${R} Q 0 ${h} 0 ${h - R}`,
    `V ${R} Q 0 0 ${R} 0 Z`,
  ].join(" ");
}

const FAN = [
  { x: -24, y: -30, r: -7 },
  { x: 0, y: -38, r: 0 },
  { x: 24, y: -30, r: 7 },
] as const;

const LIFT = [
  { x: -100, y: -125, r: -20 },
  { x: -10, y: -145, r: 6 },
  { x: 90, y: -123, r: 20 },
] as const;

const REST = [
  { x: -6, y: -4, r: 0 },
  { x: -3, y: -6, r: 0 },
  { x: 0, y: -8, r: 0 },
] as const;

export interface FolderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glass tint. @default "frost" */
  color?: FolderColor;
  /** Overall footprint. @default "md" */
  size?: "sm" | "md" | "lg";
  /** Photo shown on the sheets. A single URL covers every sheet;
      pass an array for a different photo per sheet (index-mapped).
      Omit for the abstract paper look. */
  imageSrc?: string | string[];
  /** Custom glass tint as any CSS hex (e.g. "#f6c800"). Overrides `color`. */
  tint?: string;
  /** Motion tuning. Any omitted field falls back to the designed default. */
  physics?: {
    /** Open-rise stiffness. @default 230 */
    openStiffness?: number;
    /** Open-rise damping. @default 23 */
    openDamping?: number;
    /** Landing stiffness. @default 380 */
    closeStiffness?: number;
    /** Landing damping. @default 28 */
    closeDamping?: number;
  };
}

/**
 * Frosted-glass folder in the classic silhouette: tabbed back, front
 * flap with a curved cutout the papers show through. Papers fan on
 * hover, rise on click, while the flap tips back in 3D.
 */
export function Folder({
  color = "frost",
  size = "md",
  imageSrc,
  tint,
  physics,
  className,
  ...props
}: FolderProps) {
  const [hovered, setHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const pal = tint
    ? {
        back: hexToRgba(tint, 0.3),
        front: hexToRgba(tint, 0.34),
        edge: hexToRgba(tint, 0.55),
        paper: "#f6f3ec",
        line: "#d8cfba",
        swatch: tint,
      }
    : PALETTE[color];
  const dims = DIMS[size];
  const phys = {
    openStiffness: 230,
    openDamping: 23,
    closeStiffness: 380,
    closeDamping: 28,
    ...physics,
  };
  const pose = open ? LIFT : hovered ? FAN : REST;
  const sheetSrc = (i: number) =>
    Array.isArray(imageSrc) ? imageSrc[i % imageSrc.length] : imageSrc;
  const tabH = Math.round(dims.h * 0.12);
  const back = backPath(dims.w, dims.h);
  const front = frontPath(dims.w, dims.h);

  return (
    <div
      data-slot="folder"
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={open ? "Close folder" : "Open folder"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setOpen(false);
        }}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="cursor-pointer touch-manipulation outline-none select-none focus-visible:ring-2 focus-visible:ring-brand"
        style={{ width: dims.w, height: dims.h + 90, perspective: 700 }}
      >
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {/* contact shadow grounding the folder */}
          <div
            aria-hidden
            className="absolute -bottom-3 left-1/2 h-4 w-[75%] -translate-x-1/2 rounded-[100%] bg-black/45 blur-md"
          />
          {/* back shell with tab, cut to silhouette */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 backdrop-blur-[2px]"
            style={{
              width: dims.w,
              height: dims.h + tabH,
              backgroundColor: pal.back,
              clipPath: `path("${back}")`,
            }}
          >
            {/* tonal wash: light falls off down the shell for volume */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0) 35%, rgba(0,0,0,0.10))",
                clipPath: `path("${back}")`,
              }}
            />
            {/* mouth depth: darkness pooled where the sheets emerge */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.22), rgba(0,0,0,0))",
                clipPath: `path("${back}")`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
              style={{ backgroundImage: GRAIN, clipPath: `path("${back}")` }}
            />
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${dims.w} ${dims.h + tabH}`}
              fill="none"
            >
              <path d={back} stroke={pal.edge} strokeWidth={1.5} strokeLinejoin="round" />
            </svg>
          </div>

          {/* papers */}
          {pose.map((p, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="absolute bottom-6 left-1/2 rounded-lg border shadow-sm"
              style={{ borderColor: pal.line }}
              initial={false}
              animate={{
                x: `calc(-50% + ${p.x}px)`,
                y: p.y,
                rotate: p.r,
              }}
              transition={
                open
                  ? {
                      type: "spring",
                      stiffness: phys.openStiffness,
                      damping: phys.openDamping,
                      delay: (pose.length - 1 - i) * 0.07,
                    }
                  : {
                      type: "spring",
                      stiffness: phys.closeStiffness,
                      damping: phys.closeDamping,
                      delay: i * 0.02,
                    }
              }
            >
              <div
                className="overflow-hidden rounded-lg p-2"
                style={{
                  width: dims.w * 0.52,
                  height: dims.h * 0.84,
                  backgroundColor: pal.paper,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.7), 0 -6px 12px -8px rgba(0,0,0,0.35)",
                }}
              >
                {sheetSrc(i) ? (
                  // Plain img on purpose: registry items stay free of next/image config.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={sheetSrc(i)}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="h-full w-full rounded object-cover"
                  />
                ) : (
                  <>
                    <div
                      className="h-2.5 w-3/4 rounded-full"
                      style={{ backgroundColor: pal.line }}
                    />
                    {[0, 1, 2, 3].map((r) => (
                      <div key={r} className="mt-2 flex gap-1.5">
                        <div
                          className="h-1.5 flex-1 rounded-full opacity-70"
                          style={{ backgroundColor: pal.line }}
                        />
                        <div
                          className="h-1.5 flex-1 rounded-full opacity-70"
                          style={{ backgroundColor: pal.line }}
                        />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {/* front flap with scoop cutout, tips back when open */}
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-0 origin-bottom backdrop-blur-[2px]"
            style={{
              width: dims.w,
              height: dims.h,
              backgroundColor: pal.front,
              transformStyle: "preserve-3d",
              clipPath: `path("${front}")`,
              boxShadow: "0 18px 36px -18px rgba(0, 0, 0, 0.5)",
            }}
            initial={false}
            animate={{ rotateX: open ? -42 : hovered ? -26 : -16 }}
            transition={FLAP_SPRING}
          >
            {/* bottom fold: dark seam tying the flap to the body */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[3px]"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                clipPath: `path("${front}")`,
              }}
            />
            {/* tonal wash on the flap */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0) 35%, rgba(0,0,0,0.10))",
                clipPath: `path("${front}")`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
              style={{ backgroundImage: GRAIN, clipPath: `path("${front}")` }}
            />
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox={`0 0 ${dims.w} ${dims.h}`}
              fill="none"
            >
              <path d={front} stroke={pal.edge} strokeWidth={1.5} strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
