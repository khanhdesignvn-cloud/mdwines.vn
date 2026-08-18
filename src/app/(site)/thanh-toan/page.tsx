"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";

type CustomerProfile = {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
};

export default function CheckoutPage() {
  const { items, subtotal, clear, isHydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer" | "vnpay">("cod");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

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

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim(), subtotal }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCouponError(json.error ?? "Mã giảm giá không hợp lệ");
        setCouponCode(null);
        setDiscountAmount(0);
        return;
      }
      setCouponCode(json.code);
      setDiscountAmount(json.discountAmount);
    } catch {
      setCouponError("Không thể kết nối máy chủ");
    } finally {
      setApplyingCoupon(false);
    }
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
      couponCode: couponCode ?? "",
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

      if (paymentMethod === "vnpay") {
        const vnpayRes = await fetch("/api/payment/vnpay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderCode: json.orderCode }),
        });
        const vnpayJson = await vnpayRes.json();
        if (!vnpayRes.ok) {
          setError(vnpayJson.error ?? "Không thể khởi tạo thanh toán VNPay.");
          setSubmitting(false);
          return;
        }
        clear();
        window.location.href = vnpayJson.paymentUrl;
        return;
      }

      clear();
      router.push(`/don-hang-thanh-cong/${json.orderCode}`);
    } catch {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none";

  return (
    <div className="container-lux py-10">
      <h1 className="font-serif text-3xl text-ink-900">Thanh toán</h1>
      {!profile && (
        <p className="mt-2 text-sm text-ink-700/60">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap?next=/thanh-toan" className="font-semibold text-wine-700 hover:underline">
            Đăng nhập
          </Link>{" "}
          để tự động điền thông tin giao hàng.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-xl text-ink-900">Thông tin giao hàng</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Họ và tên *</label>
                <input name="customerName" required defaultValue={profile?.name ?? ""} className={inputClass} key={profile?.name} />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink-700/80">Số điện thoại *</label>
                <input
                  name="customerPhone"
                  required
                  defaultValue={profile?.phone ?? ""}
                  className={inputClass}
                  key={profile?.phone}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-ink-700/80">Email</label>
                <input
                  name="customerEmail"
                  type="email"
                  defaultValue={profile?.email ?? ""}
                  className={inputClass}
                  key={profile?.email}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Địa chỉ giao hàng *</label>
                <textarea
                  name="customerAddress"
                  required
                  rows={2}
                  defaultValue={profile?.address ?? ""}
                  className={inputClass}
                  key={profile?.address}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-ink-700/80">Ghi chú</label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
                  className={inputClass}
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
              <label className="flex items-center gap-3 rounded-lg border border-ink-900/15 px-4 py-3 cursor-pointer has-[:checked]:border-wine-700 has-[:checked]:bg-wine-50">
                <input
                  type="radio"
                  name="paymentMethodRadio"
                  checked={paymentMethod === "vnpay"}
                  onChange={() => setPaymentMethod("vnpay")}
                />
                <div>
                  <p className="font-medium text-ink-900">Thanh toán online qua VNPay</p>
                  <p className="text-xs text-ink-700/60">
                    Thẻ ATM nội địa, thẻ quốc tế, ví điện tử — chuyển sang cổng VNPay để hoàn tất
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

          <div className="mt-4 border-t border-ink-900/10 pt-4">
            <label className="mb-1 block text-sm text-ink-700/80">Mã giảm giá</label>
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Nhập mã..."
                className="flex-1 rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm uppercase focus:border-wine-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                className="rounded-lg border border-wine-700 px-4 py-2 text-sm font-semibold text-wine-700 hover:bg-wine-50 disabled:opacity-60"
              >
                {applyingCoupon ? "..." : "Áp dụng"}
              </button>
            </div>
            {couponError && <p className="mt-1 text-xs text-red-700">{couponError}</p>}
            {couponCode && (
              <p className="mt-1 text-xs text-emerald-700">
                Đã áp dụng mã {couponCode} (-{formatVND(discountAmount)})
              </p>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-ink-900/10 pt-4 text-sm text-ink-700/80">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Giảm giá</span>
                <span>-{formatVND(discountAmount)}</span>
              </div>
            )}
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
            className="mt-6 w-full rounded-full bg-wine-800 py-3 text-sm font-semibold text-cream-50 transition-all duration-200 hover:bg-wine-700 active:scale-[0.98] disabled:opacity-60 disabled:active:scale-100"
          >
            {submitting ? "Đang xử lý..." : paymentMethod === "vnpay" ? "Tiếp tục đến VNPay" : "Đặt hàng"}
          </button>
        </div>
      </form>
    </div>
  );
}
