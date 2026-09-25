"use client";

import * as React from "react";
import { SegmentedControl } from "../../../registry/ui/segmented-control";

const OPTIONS = ["Preview", "Code", "Install"] as const;

export function SegmentedControlDemo() {
  const [value, setValue] = React.useState<string>(OPTIONS[0]);
  return (
    <SegmentedControl
      options={OPTIONS}
      value={value}
      onChange={setValue}
      label="Documentation view"
    />
  );
}
