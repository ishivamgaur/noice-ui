import { CompareSlider } from "../../../registry/ui/compare-slider";

export function CompareSliderDemo() {
  return (
    <CompareSlider
      className="w-full max-w-md"
      before={
        <div className="flex h-full w-full items-center justify-center bg-muted">
          <span className="text-sm font-medium text-muted-foreground">
            Wireframe
          </span>
        </div>
      }
      after={
        <div className="flex h-full w-full items-center justify-center bg-brand">
          <span className="text-sm font-medium text-white">Shipped</span>
        </div>
      }
    />
  );
}
