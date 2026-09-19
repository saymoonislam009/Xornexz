'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 text-center px-4">
        <motion.h1 
          className="text-9xl md:text-[12rem] font-bold font-display tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-slate-400 mt-4 mb-8 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          This page wandered off into the digital void.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
