export default function GlobalLoading() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-0.5 overflow-hidden bg-transparent">
      <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-violet-600 via-cyan-400 to-violet-600" />
    </div>
  )
}
