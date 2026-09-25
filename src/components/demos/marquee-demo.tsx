import { Marquee } from "../../../registry/ui/marquee";

/** Live demo rendered on the Marquee doc page + gallery card. */
export function MarqueeDemo() {
  return (
    <Marquee duration={20} className="w-full">
      {["Buttons", "Cards", "Spotlight", "Dot Grid", "Dialog", "Badges"].map(
        (t) => (
          <span
            key={t}
            className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
          >
            {t}
          </span>
        )
      )}
    </Marquee>
  );
}
