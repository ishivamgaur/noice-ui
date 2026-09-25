import { GlareCard } from "../../../registry/ui/glare-card";

export function GlareCardDemo() {
  return (
    <GlareCard className="w-full max-w-64 p-5">
      <p className="text-sm font-medium">Hover me</p>
      <p className="mt-1 text-[13px] text-muted-foreground">
        The glare tracks your pointer.
      </p>
    </GlareCard>
  );
}
