import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

const countrySchema = z.object({
  name: z.string().trim().min(2, "Tên quốc gia quá ngắn").max(80),
  flag: z.string().trim().max(8).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = countrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = slugify(data.name);
  if (!slug) {
    return NextResponse.json({ error: "Tên quốc gia không hợp lệ" }, { status: 400 });
  }

  const existing = await prisma.country.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Quốc gia này đã tồn tại" }, { status: 400 });
  }

  const country = await prisma.country.create({
    data: { slug, name: data.name, flag: data.flag || null },
  });

  return NextResponse.json({ id: country.id }, { status: 201 });
}
