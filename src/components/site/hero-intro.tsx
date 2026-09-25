"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { zoom, spring, STEP } from "@/lib/motion";

/**
 * One orchestrated zoom-in on first paint: badge, headline, sub, then
 * CTAs. One sequence rather than a scatter of independent effects.
 */
export function HeroIntro({
  badge,
  headline,
  sub,
  children,
}: {
  badge?: React.ReactNode;
  headline: React.ReactNode;
  sub: React.ReactNode;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const at = (index: number) =>
    reduceMotion
      ? { duration: 0 }
      : { ...spring, stiffness: 220, damping: 26, delay: index * STEP };

  return (
    <>
      {badge && (
        <motion.div
          initial={reduceMotion ? false : zoom.hidden}
          animate={zoom.shown}
          transition={at(0)}
          className="mb-4"
        >
          {badge}
        </motion.div>
      )}
      <motion.h1
        initial={reduceMotion ? false : zoom.hidden}
        animate={zoom.shown}
        transition={at(badge ? 1 : 0)}
        className="max-w-2xl text-[34px] leading-[1.1] font-semibold tracking-tight text-balance text-foreground sm:text-[46px]"
      >
        {headline}
      </motion.h1>
      <motion.p
        initial={reduceMotion ? false : zoom.hidden}
        animate={zoom.shown}
        transition={at(badge ? 2 : 1)}
        className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground"
      >
        {sub}
      </motion.p>
      <motion.div
        initial={reduceMotion ? false : zoom.hidden}
        animate={zoom.shown}
        transition={at(badge ? 3 : 2)}
        className="mt-8"
      >
        {children}
      </motion.div>
    </>
  );
}
