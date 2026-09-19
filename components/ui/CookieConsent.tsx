"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setShow(false)
  }

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected")
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-xl border border-white/10 bg-[#05060A]/95 p-6 shadow-2xl backdrop-blur-lg sm:flex sm:items-center sm:justify-between"
        >
          <div className="mb-4 sm:mb-0 sm:mr-8">
            <p className="text-sm text-gray-300">
              We use cookies to enhance your experience, analyze site traffic, and serve tailored content. 
              By continuing to browse, you consent to our use of cookies. Read our{" "}
              <Link href="/cookies" className="text-cyan-400 underline hover:text-cyan-300">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
            <button
              onClick={handleReject}
              className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
            >
              Reject All
            </button>
            <button
              onClick={handleAccept}
              className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-violet-500 hover:to-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
