"use client";

import * as React from "react";
import { Gauge } from "../../../registry/ui/gauge";

export function GaugeDemo() {
  const [value, setValue] = React.useState(42);

  React.useEffect(() => {
    const id = setInterval(() => {
      setValue(() => 25 + Math.floor(Math.random() * 70));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <Gauge value={value} label="Build health" />
  );
}
