"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Coupon } from "@prisma/client";
import { formatVND, formatDate } from "@/lib/format";

function readForm(form: FormData) {
  return {
    code: String(form.get("code") || ""),
    type: form.get("type") === "fixed" ? "fixed" : "percent",
    value: Number(form.get("value") || 0),
    minOrderAmount: Number(form.get("minOrderAmount") || 0),
    maxUses: form.get("maxUses") ? Number(form.get("maxUses")) : null,
    active: form.get("active") === "on",
    expiresAt: String(form.get("expiresAt") || ""),
  };
}

const inputClass =
  "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-ink-700/70";

function CouponFields({ coupon }: { coupon?: Coupon }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Mã (viết hoa) *</label>
        <input name="code" required defaultValue={coupon?.code} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Loại giảm giá</label>
        <select name="type" defaultValue={coupon?.type ?? "percent"} className={inputClass}>
          <option value="percent">Giảm theo %</option>
          <option value="fixed">Giảm số tiền cố định (đ)</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Giá trị *</label>
        <input name="value" type="number" required defaultValue={coupon?.value} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Đơn tối thiểu (đ)</label>
        <input
          name="minOrderAmount"
          type="number"
          defaultValue={coupon?.minOrderAmount ?? 0}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Số lượt dùng tối đa (để trống = không giới hạn)</label>
        <input name="maxUses" type="number" defaultValue={coupon?.maxUses ?? ""} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Ngày hết hạn (để trống = không hết hạn)</label>
        <input
          name="expiresAt"
          type="date"
          defaultValue={coupon?.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : ""}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} id={`active-${coupon?.id ?? "new"}`} />
        <label htmlFor={`active-${coupon?.id ?? "new"}`} className="text-sm">
          Đang kích hoạt
        </label>
      </div>
    </div>
  );
}

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readForm(new FormData(e.currentTarget))),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "Có lỗi xảy ra");
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  async function handleUpdate(id: string, form: FormData) {
    setError(null);
    setBusy(true);
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readForm(form)),
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

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Xóa mã "${code}"?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg text-ink-900">Mã giảm giá</h2>
          <p className="text-xs text-ink-700/60">Tạo mã khuyến mãi để khách nhập lúc thanh toán.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-wine-800 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-wine-700"
        >
          {showForm ? "Đóng" : "+ Tạo mã mới"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 space-y-4 rounded-xl border border-wine-700/30 p-4">
          <CouponFields />
          <button type="submit" disabled={busy} className="rounded-full bg-wine-800 px-5 py-2 text-xs font-semibold text-cream-50 disabled:opacity-60">
            Tạo mã
          </button>
        </form>
      )}

      <div className="space-y-3">
        {coupons.map((c) =>
          editingId === c.id ? (
            <form
              key={c.id}
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(c.id, new FormData(e.currentTarget));
              }}
              className="space-y-4 rounded-xl border border-wine-700/30 p-4"
            >
              <CouponFields coupon={c} />
              <div className="flex gap-2">
                <button type="submit" disabled={busy} className="rounded-full bg-wine-800 px-4 py-2 text-xs font-semibold text-cream-50">
                  Lưu
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-ink-900/15 px-4 py-2 text-xs">
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-ink-900/10 p-3 text-sm">
              <div>
                <p className="font-mono font-semibold text-ink-900">
                  {c.code}{" "}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${c.active ? "bg-emerald-100 text-emerald-700" : "bg-ink-900/10 text-ink-700"}`}>
                    {c.active ? "Đang bật" : "Đã tắt"}
                  </span>
                </p>
                <p className="text-xs text-ink-700/60">
                  {c.type === "percent" ? `Giảm ${c.value}%` : `Giảm ${formatVND(c.value)}`}
                  {c.minOrderAmount > 0 && ` · Đơn tối thiểu ${formatVND(c.minOrderAmount)}`}
                  {" · Đã dùng "}
                  {c.usedCount}
                  {c.maxUses ? `/${c.maxUses}` : ""} lượt
                  {c.expiresAt && ` · Hết hạn ${formatDate(c.expiresAt)}`}
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingId(c.id)} className="text-wine-700 hover:underline">
                  Sửa
                </button>
                <button onClick={() => handleDelete(c.id, c.code)} className="text-red-600 hover:underline">
                  Xóa
                </button>
              </div>
            </div>
          )
        )}
        {coupons.length === 0 && !showForm && (
          <p className="text-sm text-ink-700/50">Chưa có mã giảm giá nào.</p>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
