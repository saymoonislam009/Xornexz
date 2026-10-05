"use client";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./Preloader";

export default function PreloaderWrapper() {
  // null = not determined yet, true = show preloader, false = skip it
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("xornexz_preloader_seen");
      if (!seen) {
        sessionStorage.setItem("xornexz_preloader_seen", "1");
        setShow(true);
      } else {
        setShow(false);
      }
    } catch {
      setShow(false);
    }
  }, []);

  const handleDone = useCallback(() => setShow(false), []);

  // While we haven't determined state yet, render a black screen
  // This covers the brief hydration window and eliminates the flash
  if (show === null) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-[9999] bg-[#05060A]"
        style={{ pointerEvents: "none" }}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      {show && <Preloader onDone={handleDone} />}
    </AnimatePresence>
  );
}
