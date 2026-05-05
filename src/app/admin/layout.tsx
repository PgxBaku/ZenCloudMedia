import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {children}
    </div>
  );
}
