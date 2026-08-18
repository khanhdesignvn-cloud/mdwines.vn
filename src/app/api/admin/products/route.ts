import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = data.sku.toLowerCase();

  const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingSku) {
    return NextResponse.json({ error: "SKU đã tồn tại" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      slug,
      sku: data.sku,
      name: data.name,
      categoryId: data.categoryId,
      countryId: data.countryId,
      region: data.region || null,
      vintage: data.vintage ?? null,
      grapeVariety: data.grapeVariety || null,
      alcoholPercent: data.alcoholPercent ?? null,
      volumeMl: data.volumeMl,
      price: data.price,
      salePrice: data.salePrice ?? null,
      stock: data.stock,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      tastingNotes: data.tastingNotes || null,
      foodPairing: data.foodPairing || null,
      awards: data.awards || null,
      rating: data.rating,
      featured: data.featured,
      isNew: data.isNew,
      status: data.status,
      images: JSON.stringify(data.images),
    },
  });

  return NextResponse.json({ id: product.id }, { status: 201 });
}
