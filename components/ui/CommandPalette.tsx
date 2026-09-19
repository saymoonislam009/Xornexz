"use client"

import { useEffect, useState } from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Home, Briefcase, FolderOpen, Info, Cog, DollarSign, Mail, FileText, Users, Monitor, Moon, Sun } from "lucide-react"

export function CommandPalette({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#05060A] shadow-2xl"
          >
            <Command className="w-full" shouldFilter={true}>
              <div className="flex items-center border-b border-white/10 px-4">
                <Search className="mr-2 h-5 w-5 text-gray-400" />
                <Command.Input
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-gray-400 text-white"
                />
                <div className="flex items-center gap-1 rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-400">
                  <span className="text-xs">esc</span>
                </div>
              </div>

              <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
                <Command.Empty className="py-6 text-center text-sm text-gray-400">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 text-xs font-medium text-gray-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  <Command.Item onSelect={() => runCommand(() => router.push("/"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Home className="h-4 w-4" /> Home
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/services"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Briefcase className="h-4 w-4" /> Services
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/portfolio"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <FolderOpen className="h-4 w-4" /> Portfolio
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/about"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Info className="h-4 w-4" /> About
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/process"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Cog className="h-4 w-4" /> Process
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/pricing"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <DollarSign className="h-4 w-4" /> Pricing
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/contact"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Mail className="h-4 w-4" /> Contact
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/blog"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <FileText className="h-4 w-4" /> Blog
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => router.push("/careers"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Users className="h-4 w-4" /> Careers
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Theme" className="mt-2 px-2 text-xs font-medium text-gray-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  <Command.Item onSelect={() => runCommand(() => setTheme("light"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Sun className="h-4 w-4" /> Light Theme
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => setTheme("dark"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Moon className="h-4 w-4" /> Dark Theme
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => setTheme("system"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                    <Monitor className="h-4 w-4" /> System Theme
                  </Command.Item>
                </Command.Group>

                {isAuthenticated && (
                  <Command.Group heading="Admin" className="mt-2 px-2 text-xs font-medium text-gray-500 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                    <Command.Item onSelect={() => runCommand(() => router.push("/admin"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                      Dashboard
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push("/admin/settings"))} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-300 aria-selected:bg-white/10 aria-selected:text-white">
                      Settings
                    </Command.Item>
                  </Command.Group>
                )}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
