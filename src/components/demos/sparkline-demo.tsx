"use client";

import * as React from "react";
import { Sparkline } from "../../../registry/ui/sparkline";

const SERIES = [12, 18, 14, 22, 19, 27, 24, 33, 29, 38, 35, 44];

export function SparklineDemo() {
  const [shift, setShift] = React.useState(0);
  return (
    <div className="flex w-full max-w-64 flex-col items-center gap-3">
      <Sparkline
        data={SERIES.slice(shift % 3, 12).concat(SERIES.slice(0, shift % 3))}
        height={44}
        label="Weekly installs"
      />
      <button
        type="button"
        onClick={() => setShift((s) => s + 1)}
        className="text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
      >
        Next week
      </button>
    </div>
  );
}
