import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminSessionToken(token) : null;
  const pendingContactCount = await prisma.contactMessage.count({ where: { handled: false } });

  return (
    <div className="flex min-h-screen bg-cream-200/50">
      <AdminNav adminName={session?.name ?? "Quản trị viên"} pendingContactCount={pendingContactCount} />
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[720px] p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
