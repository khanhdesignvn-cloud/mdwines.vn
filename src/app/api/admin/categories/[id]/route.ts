import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục quá ngắn").max(80),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name);
  if (!slug) {
    return NextResponse.json({ error: "Tên danh mục không hợp lệ" }, { status: 400 });
  }

  const slugOwner = await prisma.category.findUnique({ where: { slug } });
  if (slugOwner && slugOwner.id !== id) {
    return NextResponse.json({ error: "Danh mục này đã tồn tại" }, { status: 400 });
  }

  await prisma.category.update({
    where: { id },
    data: { slug, name: data.name, description: data.description || null, sortOrder: data.sortOrder },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Không thể xóa: còn ${productCount} sản phẩm thuộc danh mục này` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
