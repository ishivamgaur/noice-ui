/**
 * Shared motion language. Every animation on the site uses these -
 * one spring, one entrance, one stagger step. Consistent physics
 * is what makes motion feel designed instead of random.
 */
export const spring = { type: "spring", stiffness: 300, damping: 24 } as const;

/** Stagger delay between sequential elements, in seconds. */
export const STEP = 0.09;

/** Blur-rise entrance used for hero content and scroll reveals. */
export const rise = {
  hidden: { y: 18, filter: "blur(4px)", opacity: 0 },
  shown: { y: 0, filter: "blur(0px)", opacity: 1 },
};
