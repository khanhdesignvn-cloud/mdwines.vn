"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear, isHydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");

  const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
  const total = subtotal + shippingFee;

  if (isHydrated && items.length === 0) {
    return (
      <div className="container-lux py-24 text-center">
        <h1 className="font-serif text-3xl text-ink-900">Không có sản phẩm để thanh toán</h1>
        <Link
          href="/san-pham"
          className="mt-6 inline-block rounded-full bg-wine-800 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700"
        >
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      customerName: String(form.get("customerName") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      customerAddress: String(form.get("customerAddress") || ""),
      note: String(form.get("note") || ""),
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Đã có lỗi xảy ra, vui lòng thử lại.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/don-hang-thanh-cong/${json.orderCode}`);
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-lux py-10">
      <h1 className="font-serif text-3xl text-ink-900">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-xl text-ink-900">Thông tin giao hàng</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Họ và tên *</label>
                <input
                  name="customerName"
                  required
                  className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink-700/80">Số điện thoại *</label>
                <input
                  name="customerPhone"
                  required
                  className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink-700/80">Email</label>
                <input
                  name="customerEmail"
                  type="email"
                  className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Địa chỉ giao hàng *</label>
                <textarea
                  name="customerAddress"
                  required
                  rows={2}
                  className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Ghi chú</label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                  className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-xl text-ink-900">Phương thức thanh toán</h2>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 rounded-lg border border-ink-900/15 px-4 py-3 cursor-pointer has-[:checked]:border-wine-700 has-[:checked]:bg-wine-50">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div>
                  <p className="font-medium text-ink-900">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-xs text-ink-700/60">Kiểm tra hàng trước khi thanh toán</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-ink-900/15 px-4 py-3 cursor-pointer has-[:checked]:border-wine-700 has-[:checked]:bg-wine-50">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                />
                <div>
                  <p className="font-medium text-ink-900">Chuyển khoản ngân hàng</p>
                  <p className="text-xs text-ink-700/60">
                    Thông tin chuyển khoản sẽ được gửi qua email/điện thoại sau khi đặt hàng
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
        </div>

        <div className="h-fit rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <h2 className="font-serif text-xl text-ink-900">Đơn hàng của bạn</h2>
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-ink-800">
                  {item.name} <span className="text-ink-700/50">× {item.quantity}</span>
                </span>
                <span className="font-medium text-ink-900">{formatVND(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-ink-900/10 pt-4 text-sm text-ink-700/80">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink-900/10 pt-3 font-serif text-lg text-wine-800">
            <span>Tổng cộng</span>
            <span>{formatVND(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-wine-800 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
          >
            {submitting ? "Đang xử lý..." : "Đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
}
