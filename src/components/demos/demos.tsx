import type * as React from "react";
import { ButtonDemo } from "./button-demo";
import { CardDemo } from "./card-demo";
import { SpotlightDemo } from "./spotlight-demo";
import { DotGridDemo } from "./dot-grid-demo";

/** Maps registry names to their live demos (used by gallery + doc pages). */
export const DEMOS: Record<string, () => React.JSX.Element> = {
  button: ButtonDemo,
  card: CardDemo,
  spotlight: SpotlightDemo,
  "dot-grid": DotGridDemo,
};
