/**
 * A pen scribble drawn once under a headline word when the page loads.
 * Pure CSS after paint; reduced motion shows it already drawn.
 */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 14"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-[0.12em] left-[-4%] h-[0.3em] w-[108%] overflow-visible text-brand ${className}`}
      fill="none"
    >
      <style>{`
        @keyframes nb-draw { from { stroke-dashoffset: 1 } to { stroke-dashoffset: 0 } }
        .nb-stroke { stroke-dasharray: 1; animation: nb-draw 800ms cubic-bezier(0.65,0,0.35,1) 900ms both }
        @media (prefers-reduced-motion: reduce) { .nb-stroke { animation: none } }
      `}</style>
      <path
        className="nb-stroke"
        pathLength={1}
        d="M3 10C32 6.5 62 5 117 6 88 8.2 58 10.2 30 12.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
