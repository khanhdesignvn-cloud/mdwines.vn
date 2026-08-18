import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục quá ngắn").max(80),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

export async function POST(request: Request) {
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

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Danh mục này đã tồn tại" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: { slug, name: data.name, description: data.description || null, sortOrder: data.sortOrder },
  });

  return NextResponse.json({ id: category.id }, { status: 201 });
}
