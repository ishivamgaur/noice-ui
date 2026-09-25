import { BorderBeam } from "../../../registry/ui/border-beam";

export function BorderBeamDemo() {
  return (
    <div className="relative w-full max-w-64 overflow-hidden rounded-xl border border-border bg-card p-5">
      <BorderBeam />
      <p className="relative text-sm font-medium">Light runs the edge</p>
      <p className="relative mt-1 text-[13px] text-muted-foreground">
        Pure CSS, no JS per frame.
      </p>
    </div>
  );
}
