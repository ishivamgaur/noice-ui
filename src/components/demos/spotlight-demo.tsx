import { Spotlight } from "../../../registry/ui/spotlight";

/** Live demo rendered on the Spotlight doc page + gallery card. */
export function SpotlightDemo() {
  return (
    <Spotlight className="w-full rounded-xl border border-border bg-card p-8 text-center">
      <p className="text-xl font-bold">Move your cursor</p>
      <p className="mt-1 text-sm text-muted-foreground">The glow follows you.</p>
    </Spotlight>
  );
}
