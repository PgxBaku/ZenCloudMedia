export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#f3efe6] dark:bg-[#111210] flex items-center justify-center">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="size-3 rounded-full bg-[#236b5d]/40 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}
