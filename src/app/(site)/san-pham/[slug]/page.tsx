import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { formatVND } from "@/lib/format";
import { parseProductImages } from "@/lib/product-image";

export async function generateMetadata({
  params,
}: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const effectivePrice = product.salePrice ?? product.price;

  const specs: [string, string][] = [
    ["Xuất xứ", `${product.country.flag} ${product.country.name}`],
    ["Vùng trồng", product.region ?? "—"],
    ["Giống nho", product.grapeVariety ?? "—"],
    ["Niên vụ", product.vintage ? String(product.vintage) : "NV (Non-Vintage)"],
    ["Nồng độ cồn", product.alcoholPercent ? `${product.alcoholPercent}%` : "—"],
    ["Dung tích", `${product.volumeMl}ml`],
  ];

  return (
    <div className="container-lux py-10">
      <nav className="mb-6 text-xs text-ink-700/60">
        <Link href="/" className="hover:text-wine-700">Trang chủ</Link> {" / "}
        <Link href="/san-pham" className="hover:text-wine-700">Sản phẩm</Link> {" / "}
        <Link href={`/san-pham?category=${product.category.slug}`} className="hover:text-wine-700">
          {product.category.name}
        </Link>{" "}
        / <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery
          images={parseProductImages(product.images)}
          category={product.category.slug}
          name={product.name}
        />

        <div>
          {product.isNew && (
            <span className="mb-3 inline-block rounded-full bg-wine-700 px-3 py-1 text-xs font-semibold text-cream-50">
              Sản phẩm mới
            </span>
          )}
          <h1 className="font-serif text-3xl leading-snug text-ink-900">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-700/70">SKU: {product.sku}</p>

          <div className="mt-3 flex items-center gap-1 text-gold-500 text-sm">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
            <span className="ml-1 text-ink-700/60">{product.rating.toFixed(1)}/5</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            {product.salePrice && (
              <span className="text-lg text-ink-700/40 line-through">{formatVND(product.price)}</span>
            )}
            <span className="font-serif text-3xl text-wine-800">{formatVND(effectivePrice)}</span>
          </div>
          <p className="mt-1 text-xs text-ink-700/60">
            {product.stock > 0 ? `Còn ${product.stock} chai trong kho` : "Tạm hết hàng"}
          </p>

          {product.shortDescription && (
            <p className="mt-4 leading-relaxed text-ink-800/85">{product.shortDescription}</p>
          )}

          <div className="mt-6">
            <AddToCartPanel
              productId={product.id}
              slug={product.slug}
              name={product.name}
              category={product.category.slug}
              price={effectivePrice}
              volumeMl={product.volumeMl}
              stock={product.stock}
            />
          </div>

          {product.awards && (
            <p className="mt-6 rounded-xl border border-gold-400/40 bg-gold-100/40 px-4 py-3 text-sm text-gold-600">
              🏅 {product.awards}
            </p>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-ink-900/10 pt-6 text-sm">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-ink-700/60">{label}</dt>
                <dd className="font-medium text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {product.tastingNotes && (
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-xl text-ink-900">Hương vị</h2>
            <p className="mt-3 leading-relaxed text-ink-800/85">{product.tastingNotes}</p>
          </div>
        )}
        {product.foodPairing && (
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-xl text-ink-900">Gợi ý kết hợp món ăn</h2>
            <p className="mt-3 leading-relaxed text-ink-800/85">{product.foodPairing}</p>
          </div>
        )}
      </div>

      {product.description && (
        <div className="mt-8 rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <h2 className="font-serif text-xl text-ink-900">Giới thiệu chi tiết</h2>
          <p className="mt-3 leading-relaxed text-ink-800/85">{product.description}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-serif text-2xl text-ink-900">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
