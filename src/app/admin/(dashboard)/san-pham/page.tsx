import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";

export const metadata: Metadata = { title: "Quản lý sản phẩm" };

export default async function AdminProductListPage({
  searchParams,
}: PageProps<"/admin/san-pham">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true, country: true },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink-900">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-ink-700/60">{products.length} sản phẩm</p>
        </div>
        <Link
          href="/admin/san-pham/moi"
          className="rounded-full bg-wine-800 px-5 py-2.5 text-sm font-semibold text-cream-50 hover:bg-wine-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <form action="/admin/san-pham" className="mb-6">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên hoặc SKU..."
          className="w-full max-w-sm rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2 text-sm focus:border-wine-700 focus:outline-none"
        />
      </form>

      <div className="overflow-x-auto rounded-2xl border border-ink-900/10 bg-cream-50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-cream-200/60 text-left text-xs uppercase tracking-wide text-ink-700/60">
              <th className="px-4 py-3 font-medium">Sản phẩm</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Loại</th>
              <th className="px-4 py-3 font-medium">Xuất xứ</th>
              <th className="px-4 py-3 font-medium text-right">Giá</th>
              <th className="px-4 py-3 font-medium text-right">Tồn kho</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 hover:bg-cream-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/san-pham/${p.id}`} className="font-medium text-ink-900 hover:text-wine-700">
                    {p.name}
                  </Link>
                  {p.featured && (
                    <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-600">
                      Nổi bật
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink-700/70">{p.sku}</td>
                <td className="px-4 py-3 text-ink-700/70">{p.category.name}</td>
                <td className="px-4 py-3 text-ink-700/70">{p.country.flag} {p.country.name}</td>
                <td className="px-4 py-3 text-right">
                  {p.salePrice ? (
                    <div>
                      <p className="text-ink-700/40 line-through text-xs">{formatVND(p.price)}</p>
                      <p className="font-medium text-wine-800">{formatVND(p.salePrice)}</p>
                    </div>
                  ) : (
                    <p className="font-medium">{formatVND(p.price)}</p>
                  )}
                </td>
                <td className={`px-4 py-3 text-right font-medium ${p.stock <= 10 ? "text-red-600" : ""}`}>
                  {p.stock}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-ink-900/10 text-ink-700"
                    }`}
                  >
                    {p.status === "active" ? "Đang bán" : "Đã ẩn"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/san-pham/${p.id}`} className="text-wine-700 hover:underline">
                    Sửa
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-ink-700/50">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
