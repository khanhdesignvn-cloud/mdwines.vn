import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export async function getProducts(params: {
  category?: string;
  country?: string;
  search?: string;
  sort?: SortOption;
  featuredOnly?: boolean;
  limit?: number;
}) {
  const where: Prisma.ProductWhereInput = {
    status: "active",
  };

  if (params.category) where.category = { slug: params.category };
  if (params.country) where.country = { slug: params.country };
  if (params.featuredOnly) where.featured = true;
  if (params.search) {
    where.OR = [
      { name: { contains: params.search } },
      { grapeVariety: { contains: params.search } },
      { region: { contains: params.search } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { price: "asc" };
  if (params.sort === "price-desc") orderBy = { price: "desc" };
  if (params.sort === "newest") orderBy = { createdAt: "desc" };
  if (params.sort === "featured") orderBy = { rating: "desc" };

  return prisma.product.findMany({
    where,
    orderBy,
    take: params.limit,
    include: { category: true, country: true },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, country: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 4) {
  return prisma.product.findMany({
    where: { categoryId, status: "active", id: { not: excludeId } },
    take,
    include: { category: true, country: true },
  });
}

export function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export function getCountries() {
  return prisma.country.findMany({ orderBy: { name: "asc" } });
}

export function getNewsPosts(limit?: number) {
  return prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" }, take: limit });
}

export function getNewsPostBySlug(slug: string) {
  return prisma.newsPost.findUnique({ where: { slug } });
}
