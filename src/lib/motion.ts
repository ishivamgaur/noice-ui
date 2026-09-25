/**
 * Shared motion language. Every animation on the site uses these -
 * one spring, one entrance, one stagger step. Consistent physics
 * is what makes motion feel designed instead of random.
 */
export const spring = { type: "spring", stiffness: 300, damping: 24 } as const;

/** Stagger delay between sequential elements, in seconds. */
export const STEP = 0.07;

/**
 * Zoom entrance. Content arrives by scaling up from slightly small and
 * soft rather than sliding up from below, which keeps the page feeling
 * like it opens toward you instead of assembling itself.
 */
export const zoom = {
  hidden: { scale: 0.94, opacity: 0, filter: "blur(6px)" },
  shown: { scale: 1, opacity: 1, filter: "blur(0px)" },
};
