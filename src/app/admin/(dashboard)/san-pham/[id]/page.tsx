import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategories, getCountries } from "@/lib/data";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({
  params,
}: PageProps<"/admin/san-pham/[id]">) {
  const { id } = await params;
  const [product, categories, countries] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getCategories(),
    getCountries(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Sửa sản phẩm</h1>
      <p className="mt-1 text-sm text-ink-700/60">{product.name}</p>
      <div className="mt-6 max-w-3xl">
        <ProductForm categories={categories} countries={countries} product={product} />
      </div>
    </div>
  );
}
