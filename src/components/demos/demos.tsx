import type * as React from "react";
import { ButtonDemo } from "./button-demo";
import { CardDemo } from "./card-demo";
import { SpotlightDemo } from "./spotlight-demo";
import { DotGridDemo } from "./dot-grid-demo";
import { MarqueeDemo } from "./marquee-demo";
import { NumberTickerDemo } from "./number-ticker-demo";
import { ScrollProgressDemo } from "./scroll-progress-demo";
import { GlareCardDemo } from "./glare-card-demo";
import { AnimatedListDemo } from "./animated-list-demo";
import { BorderBeamDemo } from "./border-beam-demo";
import { TextRevealDemo } from "./text-reveal-demo";
import { AccordionDemo } from "./accordion-demo";
import { GaugeDemo } from "./gauge-demo";
import { LoaderSetDemo } from "./loader-set-demo";
import { AvatarStackDemo } from "./avatar-stack-demo";
import { NumberStepperDemo } from "./number-stepper-demo";
import { ExpandingSearchDemo } from "./expanding-search-demo";
import { OtpInputDemo } from "./otp-input-demo";
import { CodeBlockDemo } from "./code-block-demo";
import { GooeyNavDemo } from "./gooey-nav-demo";
import { CommandPaletteDemo } from "./command-palette-demo";
import { MagneticButtonDemo } from "./magnetic-button-demo";
import { TextScrambleDemo } from "./text-scramble-demo";
import { CompareSliderDemo } from "./compare-slider-demo";
import { SlideToConfirmDemo } from "./slide-to-confirm-demo";
import { HoldToDeleteDemo } from "./hold-to-delete-demo";
import { TiltCardDemo } from "./tilt-card-demo";
import { SegmentedControlDemo } from "./segmented-control-demo";
import { SparklineDemo } from "./sparkline-demo";
import { TaskListDemo } from "./task-list-demo";
import { WordRotatorDemo } from "./word-rotator-demo";

/** Maps registry names to their live demos (used by gallery + doc pages). */
export const DEMOS: Record<string, () => React.JSX.Element> = {
  button: ButtonDemo,
  card: CardDemo,
  spotlight: SpotlightDemo,
  "dot-grid": DotGridDemo,
  marquee: MarqueeDemo,
  "number-ticker": NumberTickerDemo,
  "scroll-progress": ScrollProgressDemo,
  "glare-card": GlareCardDemo,
  "animated-list": AnimatedListDemo,
  "border-beam": BorderBeamDemo,
  "text-reveal": TextRevealDemo,
  accordion: AccordionDemo,
  gauge: GaugeDemo,
  "loader-set": LoaderSetDemo,
  "avatar-stack": AvatarStackDemo,
  "number-stepper": NumberStepperDemo,
  "expanding-search": ExpandingSearchDemo,
  "otp-input": OtpInputDemo,
  "code-block": CodeBlockDemo,
  "gooey-nav": GooeyNavDemo,
  "command-palette": CommandPaletteDemo,
  "magnetic-button": MagneticButtonDemo,
  "text-scramble": TextScrambleDemo,
  "compare-slider": CompareSliderDemo,
  "slide-to-confirm": SlideToConfirmDemo,
  "hold-to-delete": HoldToDeleteDemo,
  "tilt-card": TiltCardDemo,
  "segmented-control": SegmentedControlDemo,
  sparkline: SparklineDemo,
  "task-list": TaskListDemo,
  "word-rotator": WordRotatorDemo,
};
