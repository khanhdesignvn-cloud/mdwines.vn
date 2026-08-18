"use client";

import { useState } from "react";
import { formatVND, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/order-status";

type LookupOrder = {
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  status: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: { id: string; productName: string; price: number; quantity: number; total: number }[];
};

export default function OrderLookupPage() {
  const [order, setOrder] = useState<LookupOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: String(form.get("orderCode") || ""),
          phone: String(form.get("phone") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể tra cứu đơn hàng");
        setSubmitting(false);
        return;
      }
      setOrder(json.order);
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-lux max-w-2xl py-10">
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] text-wine-700">HỖ TRỢ KHÁCH HÀNG</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">Tra cứu đơn hàng</h1>
        <p className="mt-2 text-sm text-ink-700/70">
          Nhập mã đơn hàng và số điện thoại đã đặt để xem trạng thái xử lý.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-ink-900/10 bg-cream-50 p-6 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-ink-700/70">Mã đơn hàng *</label>
          <input
            name="orderCode"
            required
            placeholder="MDW2026..."
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-wine-700 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-ink-700/70">Số điện thoại đặt hàng *</label>
          <input
            name="phone"
            required
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2.5 text-sm focus:border-wine-700 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-wine-800 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
        >
          {submitting ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {order && (
        <div className="mt-8 rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-serif text-xl text-wine-800">{order.orderCode}</p>
              <p className="text-xs text-ink-700/60">Đặt lúc {formatDateTime(order.createdAt)}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${ORDER_STATUS_COLOR[order.status]}`}>
              {ORDER_STATUS_LABEL[order.status]}
            </span>
          </div>

          <div className="mt-5 space-y-2 border-t border-ink-900/10 pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span>{formatVND(item.total)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-900/10 pt-4 font-serif text-lg text-wine-800">
            <span>Tổng cộng</span>
            <span>{formatVND(order.total)}</span>
          </div>

          <dl className="mt-5 space-y-1 border-t border-ink-900/10 pt-4 text-sm text-ink-700/80">
            <div className="flex justify-between">
              <dt>Người nhận</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Địa chỉ</dt>
              <dd className="max-w-xs text-right">{order.customerAddress}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Thanh toán</dt>
              <dd>{order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng" : "Chuyển khoản ngân hàng"}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
