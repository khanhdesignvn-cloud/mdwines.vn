import type { Metadata } from "next";
import { getCategories, getCountries } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProductPage() {
  const [categories, countries] = await Promise.all([getCategories(), getCountries()]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Thêm sản phẩm mới</h1>
      <p className="mt-1 text-sm text-ink-700/60">Điền thông tin chi tiết cho chai vang mới.</p>
      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} countries={countries} />
      </div>
    </div>
  );
}
