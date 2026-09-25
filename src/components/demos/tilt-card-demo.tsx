import { TiltCard } from "../../../registry/ui/tilt-card";

export function TiltCardDemo() {
  return (
    <TiltCard className="w-full max-w-64">
      <div className="p-6">
        <p className="text-[15px] font-medium tracking-tight">Tilt me</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          The card follows your pointer with real perspective.
        </p>
      </div>
    </TiltCard>
  );
}
