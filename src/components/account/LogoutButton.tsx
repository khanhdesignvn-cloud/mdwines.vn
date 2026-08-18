"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/customer/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-ink-900/15 px-5 py-2 text-sm text-ink-800 hover:bg-cream-200"
    >
      Đăng xuất
    </button>
  );
}
