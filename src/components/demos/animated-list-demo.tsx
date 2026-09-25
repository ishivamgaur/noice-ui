import { AnimatedList } from "../../../registry/ui/animated-list";

const ITEMS = ["Copy the command", "Paste into your app", "Own the source"];

export function AnimatedListDemo() {
  return (
    <AnimatedList className="w-full max-w-64 space-y-2">
      {ITEMS.map((item, i) => (
        <div
          key={item}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
        >
          <span className="font-mono text-[10px] text-muted-foreground">
            0{i + 1}
          </span>
          <span className="text-[13px]">{item}</span>
        </div>
      ))}
    </AnimatedList>
  );
}
