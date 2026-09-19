"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./Preloader";

export default function PreloaderWrapper() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on the first visit of a session — no blocking on return visits
    try {
      const seen = sessionStorage.getItem("xornexz_preloader_seen");
      if (!seen) {
        setShow(true);
        sessionStorage.setItem("xornexz_preloader_seen", "1");
      }
    } catch {
      // sessionStorage may be blocked in some privacy modes — silently skip
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && <Preloader onDone={() => setShow(false)} />}
    </AnimatePresence>
  );
}
