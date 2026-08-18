"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatVND } from "@/lib/format";
import { WineBottleArt } from "@/components/product/WineBottleArt";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, isHydrated } = useCart();

  if (isHydrated && items.length === 0) {
    return (
      <div className="animate-fade-up container-lux py-24 text-center">
        <h1 className="font-serif text-3xl text-ink-900">Giỏ hàng của bạn đang trống</h1>
        <p className="mt-3 text-ink-700/70">Hãy khám phá bộ sưu tập rượu vang của MDWines Cellar.</p>
        <Link
          href="/san-pham"
          className="mt-6 inline-block rounded-full bg-wine-800 px-7 py-3 text-sm font-semibold text-cream-50 transition-transform duration-200 hover:scale-105 hover:bg-wine-700 active:scale-95"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up container-lux py-10">
      <h1 className="font-serif text-3xl text-ink-900">Giỏ hàng</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-2xl border border-ink-900/10 bg-cream-50 p-4 transition-shadow duration-200 hover:shadow-md"
            >
              <Link href={`/san-pham/${item.slug}`} className="shrink-0">
                <WineBottleArt category={item.category} className="h-24 w-auto" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/san-pham/${item.slug}`} className="font-serif text-base text-ink-900 hover:text-wine-700">
                  {item.name}
                </Link>
                <p className="text-xs text-ink-700/60">{item.volumeMl}ml</p>
                <p className="mt-1 font-medium text-wine-800">{formatVND(item.price)}</p>
              </div>
              <div className="flex items-center rounded-full border border-ink-900/15">
                <button
                  className="px-3 py-1.5 text-ink-800 transition-transform active:scale-90"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  className="px-3 py-1.5 text-ink-800 transition-transform active:scale-90"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <p className="w-28 text-right font-serif text-wine-800">
                {formatVND(item.price * item.quantity)}
              </p>
              <button
                aria-label="Xóa sản phẩm"
                onClick={() => removeItem(item.productId)}
                className="text-ink-700/50 transition-all duration-200 hover:scale-110 hover:text-wine-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <h2 className="font-serif text-xl text-ink-900">Tóm tắt đơn hàng</h2>
          <div className="mt-4 flex justify-between text-sm text-ink-700/80">
            <span>Tạm tính</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink-700/80">
            <span>Phí vận chuyển</span>
            <span>{subtotal >= 2000000 || subtotal === 0 ? "Miễn phí" : "Tính khi thanh toán"}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-900/10 pt-4 font-serif text-lg text-wine-800">
            <span>Tổng cộng</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          <Link
            href="/thanh-toan"
            className="mt-6 block rounded-full bg-wine-800 py-3 text-center text-sm font-semibold text-cream-50 transition-all duration-200 hover:bg-wine-700 active:scale-[0.98]"
          >
            Tiến hành thanh toán
          </Link>
          <Link
            href="/san-pham"
            className="mt-3 block text-center text-sm text-wine-700 hover:underline"
          >
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
