import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }

  const skuOwner = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (skuOwner && skuOwner.id !== id) {
    return NextResponse.json({ error: "SKU đã tồn tại" }, { status: 400 });
  }

  const slug = data.sku.toLowerCase();

  await prisma.product.update({
    where: { id },
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
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const usedInOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
  if (usedInOrders) {
    await prisma.product.update({ where: { id }, data: { status: "hidden" } });
    return NextResponse.json({
      ok: true,
      hidden: true,
      message: "Sản phẩm đã có trong đơn hàng nên được ẩn thay vì xóa hẳn.",
    });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true, hidden: false });
}
