import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const lookupSchema = z.object({
  orderCode: z.string().trim().min(1),
  phone: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = lookupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Vui lòng nhập đầy đủ thông tin" }, { status: 400 });
  }

  const { orderCode, phone } = parsed.data;

  const order = await prisma.order.findFirst({
    where: {
      orderCode: orderCode.trim().toUpperCase(),
      customerPhone: phone.trim(),
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
