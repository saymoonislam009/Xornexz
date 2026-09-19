"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface PreloaderProps {
  onDone: () => void;
}

export default function Preloader({ onDone }: PreloaderProps) {
  useEffect(() => {
    // Total time: ~1.2s — does not lock scroll
    const t = setTimeout(onDone, 1200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05060A]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex flex-col items-center gap-5"
      >
        {/* Wordmark */}
        <span className="text-3xl md:text-4xl font-display font-black tracking-tight text-white select-none">
          X<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">ornexz</span>
        </span>

        {/* Progress bar */}
        <div className="relative w-40 h-px bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
