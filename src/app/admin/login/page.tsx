import { adminLogin } from "@/app/admin/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xs flex flex-col gap-6 border border-current/20 p-8">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest opacity-40">ZenCloudMedia</p>
          <h1 className="text-xl font-bold tracking-tight">Admin</h1>
        </div>

        {searchParams.error && (
          <p className="text-xs text-rose-400">Incorrect password.</p>
        )}

        <form action={adminLogin} className="flex flex-col gap-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="bg-transparent border border-current/25 px-3 py-2 text-sm focus:outline-none focus:border-current/60"
          />
          <button
            type="submit"
            className="border border-current px-4 py-2 text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
