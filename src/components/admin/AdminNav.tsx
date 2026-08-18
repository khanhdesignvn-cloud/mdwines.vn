"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Tổng quan", icon: "📊", exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm", icon: "🍷" },
  { href: "/admin/don-hang", label: "Đơn hàng", icon: "📦" },
  { href: "/admin/danh-muc", label: "Danh mục", icon: "🏷️" },
  { href: "/admin/lien-he", label: "Liên hệ", icon: "✉️" },
];

export function AdminNav({
  adminName,
  pendingContactCount = 0,
}: {
  adminName: string;
  pendingContactCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-ink-900 text-cream-100">
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400 font-serif text-gold-300">
          MD
        </span>
        <div>
          <p className="font-serif text-sm text-gold-gradient">MDWines Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                active ? "bg-gold-400 text-ink-900 font-semibold" : "text-cream-200/80 hover:bg-white/5"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
              {link.href === "/admin/lien-he" && pendingContactCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-wine-600 px-1 text-[11px] font-semibold text-cream-50">
                  {pendingContactCount}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-cream-200/60 hover:bg-white/5"
        >
          <span>🔗</span>
          Xem website
        </Link>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-xs text-cream-300/60">Đăng nhập: {adminName}</p>
        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-lg border border-white/15 py-2 text-xs text-cream-200/80 hover:bg-white/5"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
