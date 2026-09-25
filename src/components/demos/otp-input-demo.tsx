"use client";

import * as React from "react";
import { OtpInput } from "../../../registry/ui/otp-input";

export function OtpInputDemo() {
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">(
    "idle"
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <OtpInput
        length={6}
        value={code}
        onChange={(next) => {
          setCode(next);
          setStatus("idle");
        }}
        onComplete={(done) =>
          setStatus(done === "246810" ? "success" : "error")
        }
        status={status}
      />
      <p className="text-[13px] text-muted-foreground">
        {status === "success"
          ? "Code accepted."
          : status === "error"
            ? "Wrong code, try 246810."
            : "Hint: the code is 246810."}
      </p>
    </div>
  );
}
