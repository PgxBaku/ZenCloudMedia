export default function ResumeLoading() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="h-1 w-48 mx-auto rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-indigo-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>
        <p className="mt-4 text-sm text-white/40 font-medium tracking-wide">
          Loading resume
        </p>
      </div>
    </div>
  )
}
