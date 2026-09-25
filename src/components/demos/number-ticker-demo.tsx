import { NumberTicker } from "../../../registry/ui/number-ticker";

export function NumberTickerDemo() {
  return (
    <div className="flex items-baseline gap-2 text-4xl font-semibold tracking-tight">
      <NumberTicker value={1240} />
      <span className="text-base font-normal text-muted-foreground">
        components
      </span>
    </div>
  );
}
