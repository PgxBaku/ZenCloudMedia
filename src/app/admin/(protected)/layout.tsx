import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const jar = await cookies();
  if (jar.get("admin_session")?.value !== "1") {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
