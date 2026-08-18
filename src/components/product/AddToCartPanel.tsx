"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export function AddToCartPanel({
  productId,
  slug,
  name,
  category,
  price,
  volumeMl,
  stock,
}: {
  productId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  volumeMl: number;
  stock: number;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = stock <= 0;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-full border border-ink-900/15">
        <button
          type="button"
          aria-label="Giảm số lượng"
          className="px-4 py-2 text-lg text-ink-800 disabled:opacity-30"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={outOfStock}
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
        <button
          type="button"
          aria-label="Tăng số lượng"
          className="px-4 py-2 text-lg text-ink-800 disabled:opacity-30"
          onClick={() => setQty((q) => Math.min(stock || 99, q + 1))}
          disabled={outOfStock}
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          addItem({ productId, slug, name, category, price, volumeMl, stock }, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="flex-1 min-w-[180px] rounded-full bg-wine-800 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-wine-700 disabled:cursor-not-allowed disabled:bg-ink-900/20"
      >
        {outOfStock ? "Hết hàng" : added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ hàng"}
      </button>

      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          addItem({ productId, slug, name, category, price, volumeMl, stock }, qty);
          router.push("/thanh-toan");
        }}
        className="rounded-full border border-wine-800 px-6 py-3 text-sm font-semibold text-wine-800 transition-colors hover:bg-wine-800 hover:text-cream-50 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Mua ngay
      </button>
    </div>
  );
}
