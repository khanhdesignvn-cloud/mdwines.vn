import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getCountries, getProducts, type SortOption } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Khám phá bộ sưu tập rượu vang nhập khẩu cao cấp tại MDWines Cellar.",
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Nổi bật" },
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

export default async function ProductListPage({
  searchParams,
}: PageProps<"/san-pham">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const country = typeof sp.country === "string" ? sp.country : undefined;
  const search = typeof sp.q === "string" ? sp.q : undefined;
  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as SortOption;

  const [products, categories, countries] = await Promise.all([
    getProducts({ category, country, search, sort }),
    getCategories(),
    getCountries(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { category, country, q: search, sort, ...overrides };
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    return qs ? `/san-pham?${qs}` : "/san-pham";
  };

  return (
    <div className="container-lux py-10">
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] text-wine-700">BỘ SƯU TẬP</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">
          {activeCategory ? activeCategory.name : "Tất cả sản phẩm"}
        </h1>
        {activeCategory?.description && (
          <p className="mt-2 max-w-2xl text-sm text-ink-700/70">{activeCategory.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-8">
          <form action="/san-pham" className="flex gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            {country && <input type="hidden" name="country" value={country} />}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Tìm theo tên, giống nho, vùng..."
              className="w-full rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2 text-sm focus:border-wine-700 focus:outline-none"
            />
          </form>

          <div>
            <h3 className="mb-3 font-serif text-lg text-ink-900">Loại rượu</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href={buildHref({ category: undefined })}
                  className={`block rounded-lg px-3 py-2 ${
                    !category ? "bg-wine-800 text-cream-50" : "text-ink-800 hover:bg-cream-200"
                  }`}
                >
                  Tất cả
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={buildHref({ category: c.slug })}
                    className={`block rounded-lg px-3 py-2 ${
                      category === c.slug
                        ? "bg-wine-800 text-cream-50"
                        : "text-ink-800 hover:bg-cream-200"
                    }`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-serif text-lg text-ink-900">Xuất xứ</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  href={buildHref({ country: undefined })}
                  className={`block rounded-lg px-3 py-2 ${
                    !country ? "bg-wine-800 text-cream-50" : "text-ink-800 hover:bg-cream-200"
                  }`}
                >
                  Tất cả
                </Link>
              </li>
              {countries.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={buildHref({ country: c.slug })}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                      country === c.slug
                        ? "bg-wine-800 text-cream-50"
                        : "text-ink-800 hover:bg-cream-200"
                    }`}
                  >
                    <span>{c.flag}</span> {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-ink-700/70">{products.length} sản phẩm</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-700/60">Sắp xếp:</span>
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={buildHref({ sort: opt.value })}
                  className={`rounded-full px-3 py-1 ${
                    sort === opt.value
                      ? "bg-gold-400 text-ink-900 font-semibold"
                      : "text-ink-700 hover:bg-cream-200"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-900/15 py-20 text-center text-ink-700/60">
              Không tìm thấy sản phẩm phù hợp. Vui lòng thử bộ lọc khác.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
