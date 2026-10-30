"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CommandPalette = dynamic(
  () => import("@/components/ui/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

/** Loads the command palette bundle only after the first Cmd/Ctrl+K press. */
export function LazyCommandPalette() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setArmed(true);
        // Re-dispatch once the chunk has mounted so the palette opens on this press.
        setTimeout(() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: e.metaKey, ctrlKey: e.ctrlKey })
          );
        }, 400);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [armed]);

  return armed ? <CommandPalette /> : null;
}
