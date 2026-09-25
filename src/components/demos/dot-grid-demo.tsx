import { DotGrid } from "../../../registry/ui/dot-grid";

/** Live demo rendered on the Dot Grid doc page + gallery card. */
export function DotGridDemo() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-border bg-card">
      <DotGrid />
      <p className="relative p-6 text-sm text-muted-foreground">
        Content sits above the grid.
      </p>
    </div>
  );
}
