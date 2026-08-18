import type { Metadata } from "next";
import { getCategories, getCountries } from "@/lib/data";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { CountryManager } from "@/components/admin/CountryManager";

export const metadata: Metadata = { title: "Quản lý danh mục" };

export default async function AdminTaxonomyPage() {
  const [categories, countries] = await Promise.all([getCategories(), getCountries()]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Quản lý danh mục</h1>
      <p className="mt-1 text-sm text-ink-700/60">
        Thêm, sửa hoặc xóa loại rượu và quốc gia xuất xứ hiển thị trên website.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryManager categories={categories} />
        <CountryManager countries={countries} />
      </div>
    </div>
  );
}
