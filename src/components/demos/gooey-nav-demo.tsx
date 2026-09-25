import { GooeyNav } from "../../../registry/ui/gooey-nav";

export function GooeyNavDemo() {
  return (
    <GooeyNav
      items={["Home", "Components", "Docs", "Blog"]}
      defaultValue={1}
      className="w-full max-w-80"
    />
  );
}
