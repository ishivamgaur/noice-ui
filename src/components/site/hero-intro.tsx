"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { rise, spring, STEP } from "@/lib/motion";

/** Staggered blur-rise entrance for hero content: badge → headline → sub → CTAs. */
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
  const step = (index: number) =>
    reduceMotion ? { duration: 0 } : { ...spring, delay: index * STEP };

  return (
    <>
      {badge && (
        <motion.div
          initial={reduceMotion ? false : rise.hidden}
          animate={rise.shown}
          transition={step(0)}
          className="mb-4"
        >
          {badge}
        </motion.div>
      )}
      <motion.h1
        initial={reduceMotion ? false : rise.hidden}
        animate={rise.shown}
        transition={step(badge ? 1 : 0)}
        className="mt-4 max-w-3xl text-balance font-display text-3xl font-black leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {headline}
      </motion.h1>
      <motion.p
        initial={reduceMotion ? false : rise.hidden}
        animate={rise.shown}
        transition={step(badge ? 2 : 1)}
        className="mt-5 max-w-xl text-balance text-muted-foreground sm:text-base"
      >
        {sub}
      </motion.p>
      <motion.div
        initial={reduceMotion ? false : rise.hidden}
        animate={rise.shown}
        transition={step(badge ? 3 : 2)}
        className="mt-8"
      >
        {children}
      </motion.div>
    </>
  );
}
