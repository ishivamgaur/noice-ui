import { WordRotator } from "../../../registry/ui/word-rotator";

export function WordRotatorDemo() {
  return (
    <span className="text-2xl font-semibold tracking-tight">
      <WordRotator words={["copy it", "read it", "own it", "change it"]} />
    </span>
  );
}
