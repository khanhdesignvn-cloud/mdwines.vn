"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Country } from "@prisma/client";

export function CountryManager({ countries }: { countries: Country[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/countries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        flag: String(form.get("flag") || ""),
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Có lỗi xảy ra");
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  async function handleUpdate(id: string, form: FormData) {
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/countries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        flag: String(form.get("flag") || ""),
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Có lỗi xảy ra");
      return;
    }
    setEditingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Xóa quốc gia "${name}"?`)) return;
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/countries/${id}`, { method: "DELETE" });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Không thể xóa quốc gia");
      return;
    }
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none";

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
      <h2 className="font-serif text-lg text-ink-900">Xuất xứ</h2>
      <p className="mt-1 text-xs text-ink-700/60">Danh sách quốc gia dùng để lọc sản phẩm.</p>

      <div className="mt-4 space-y-3">
        {countries.map((c) =>
          editingId === c.id ? (
            <form
              key={c.id}
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(c.id, new FormData(e.currentTarget));
              }}
              className="grid grid-cols-1 gap-2 rounded-lg border border-wine-700/30 p-3 sm:grid-cols-[70px_2fr_auto]"
            >
              <input name="flag" defaultValue={c.flag ?? ""} placeholder="🇫🇷" className={inputClass} />
              <input name="name" defaultValue={c.name} required className={inputClass} />
              <div className="flex gap-2">
                <button type="submit" disabled={busy} className="rounded-lg bg-wine-800 px-3 py-2 text-xs font-semibold text-cream-50">
                  Lưu
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border border-ink-900/15 px-3 py-2 text-xs">
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-900/10 p-3 text-sm">
              <p className="font-medium text-ink-900">{c.flag} {c.name}</p>
              <div className="flex gap-3">
                <button onClick={() => setEditingId(c.id)} className="text-wine-700 hover:underline">
                  Sửa
                </button>
                <button onClick={() => handleDelete(c.id, c.name)} className="text-red-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 gap-2 border-t border-ink-900/10 pt-4 sm:grid-cols-[70px_2fr_auto]">
        <input name="flag" placeholder="🇫🇷" className={inputClass} />
        <input name="name" placeholder="Tên quốc gia mới" required className={inputClass} />
        <button type="submit" disabled={busy} className="rounded-lg bg-wine-800 px-3 py-2 text-xs font-semibold text-cream-50 disabled:opacity-60">
          + Thêm
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
