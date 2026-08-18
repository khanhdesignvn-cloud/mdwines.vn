"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Customer } from "@prisma/client";

export function ProfileForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/customer/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          phone: String(form.get("phone") || ""),
          address: String(form.get("address") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể lưu thay đổi");
        setSubmitting(false);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 text-sm focus:border-wine-700 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-ink-700/80">Email</label>
        <input value={customer.email} disabled className={`${inputClass} bg-cream-200/60 text-ink-700/60`} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-700/80">Họ và tên</label>
        <input name="name" defaultValue={customer.name} required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-700/80">Số điện thoại</label>
        <input name="phone" defaultValue={customer.phone ?? ""} className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-700/80">Địa chỉ giao hàng mặc định</label>
        <textarea name="address" defaultValue={customer.address ?? ""} rows={2} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-emerald-700">Đã lưu thay đổi.</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-wine-800 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
      >
        {submitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </form>
  );
}
