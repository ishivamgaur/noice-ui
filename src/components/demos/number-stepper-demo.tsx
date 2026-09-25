"use client";

import * as React from "react";
import { NumberStepper } from "../../../registry/ui/number-stepper";

export function NumberStepperDemo() {
  const [value, setValue] = React.useState(9);
  return (
    <NumberStepper label="Copies" value={value} onChange={setValue} max={99} />
  );
}
