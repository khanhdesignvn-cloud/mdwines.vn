"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        description: String(form.get("description") || ""),
        sortOrder: Number(form.get("sortOrder") || 0),
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
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(form.get("name") || ""),
        description: String(form.get("description") || ""),
        sortOrder: Number(form.get("sortOrder") || 0),
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
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Không thể xóa danh mục");
      return;
    }
    router.refresh();
  }

  const inputClass =
    "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none";

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
      <h2 className="font-serif text-lg text-ink-900">Loại rượu</h2>
      <p className="mt-1 text-xs text-ink-700/60">
        Danh mục hiển thị trong menu và bộ lọc sản phẩm ở trang khách hàng.
      </p>

      <div className="mt-4 space-y-3">
        {categories.map((c) =>
          editingId === c.id ? (
            <form
              key={c.id}
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(c.id, new FormData(e.currentTarget));
              }}
              className="grid grid-cols-1 gap-2 rounded-lg border border-wine-700/30 p-3 sm:grid-cols-[1.5fr_2fr_80px_auto]"
            >
              <input name="name" defaultValue={c.name} required className={inputClass} />
              <input name="description" defaultValue={c.description ?? ""} className={inputClass} />
              <input name="sortOrder" type="number" defaultValue={c.sortOrder} className={inputClass} />
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
              <div>
                <p className="font-medium text-ink-900">{c.name}</p>
                {c.description && <p className="text-xs text-ink-700/60">{c.description}</p>}
              </div>
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

      <form onSubmit={handleCreate} className="mt-4 grid grid-cols-1 gap-2 border-t border-ink-900/10 pt-4 sm:grid-cols-[1.5fr_2fr_80px_auto]">
        <input name="name" placeholder="Tên danh mục mới" required className={inputClass} />
        <input name="description" placeholder="Mô tả ngắn" className={inputClass} />
        <input name="sortOrder" type="number" placeholder="Thứ tự" defaultValue={0} className={inputClass} />
        <button type="submit" disabled={busy} className="rounded-lg bg-wine-800 px-3 py-2 text-xs font-semibold text-cream-50 disabled:opacity-60">
          + Thêm
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
