"use client";

import Link from "next/link";
import Image from "next/image";
import type { Category, Country, Product } from "@prisma/client";
import { WineBottleArt } from "./WineBottleArt";
import { formatVND } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { parseProductImages } from "@/lib/product-image";

export type ProductWithRelations = Product & { category: Category; country: Country };

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();
  const outOfStock = product.stock <= 0;
  const effectivePrice = product.salePrice ?? product.price;
  const [coverImage] = parseProductImages(product.images);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 shadow-sm transition-shadow hover:shadow-xl hover:shadow-wine-900/10">
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative flex h-64 items-center justify-center bg-gradient-to-b from-cream-200 to-cream-100 overflow-hidden"
      >
        {product.isNew && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-wine-700 px-3 py-1 text-[11px] font-semibold text-cream-50">
            Mới
          </span>
        )}
        {product.salePrice && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-semibold text-ink-900">
            -{Math.round(100 - (product.salePrice / product.price) * 100)}%
          </span>
        )}
        {coverImage ? (
          <Image
            src={coverImage}
            alt={product.name}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <WineBottleArt
            category={product.category.slug}
            className="h-56 w-auto drop-shadow-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-wine-700">
          {product.country.flag} {product.country.name} · {product.region ?? product.category.name}
        </p>
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="font-serif text-base leading-snug text-ink-900 line-clamp-2 hover:text-wine-700">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 text-gold-500 text-xs">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
          <span className="text-ink-700/60 ml-1">{product.rating.toFixed(1)}</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {product.salePrice && (
              <p className="text-xs text-ink-700/50 line-through">{formatVND(product.price)}</p>
            )}
            <p className="font-serif text-lg text-wine-800">{formatVND(effectivePrice)}</p>
          </div>
          <button
            disabled={outOfStock}
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                category: product.category.slug,
                price: effectivePrice,
                volumeMl: product.volumeMl,
                stock: product.stock,
              })
            }
            className="rounded-full bg-wine-800 px-4 py-2 text-xs font-semibold text-cream-50 transition-colors hover:bg-wine-700 disabled:cursor-not-allowed disabled:bg-ink-900/20"
          >
            {outOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
}
