"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export interface AnimatedListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Seconds between each child. @default 0.06 */
  stagger?: number;
  /** Travel distance in px. @default 14 */
  distance?: number;
  /** Fraction visible before it plays. @default 0.25 */
  amount?: number;
}

/**
 * Reveals its direct children in sequence the first time the block
 * scrolls into view. Plays once, and renders flat under reduced motion.
 */
export function AnimatedList({
  children,
  className,
  stagger = 0.06,
  distance = 14,
  amount = 0.25,
  ...props
}: AnimatedListProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: stagger } },
      }}
      className={className}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {React.Children.map(children, (child, i) =>
        React.isValidElement(child) ? (
          <motion.div
            key={child.key ?? i}
            variants={{
              hidden: { opacity: 0, y: distance, filter: "blur(4px)" },
              shown: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 260, damping: 26 },
              },
            }}
          >
            {child}
          </motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}
