import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  phone: z.string().trim().min(9, "Số điện thoại không hợp lệ").max(15),
  email: z.string().trim().email().optional().or(z.literal("")),
  message: z.string().trim().min(5, "Vui lòng nhập nội dung").max(2000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  await prisma.contactMessage.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      message: data.message,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
