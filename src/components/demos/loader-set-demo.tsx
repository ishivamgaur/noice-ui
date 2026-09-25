"use client";

import * as React from "react";
import { LoaderSet } from "../../../registry/ui/loader-set";

export function LoaderSetDemo() {
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (done) {
      const t = setTimeout(() => setDone(false), 1600);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <button type="button" onClick={() => setDone(true)} className="cursor-default">
      <LoaderSet done={done} />
    </button>
  );
}
