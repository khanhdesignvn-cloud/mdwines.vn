import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().int().min(0),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const { code, subtotal } = parsed.data;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Mã giảm giá không hợp lệ" }, { status: 404 });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: "Mã giảm giá đã hết hạn" }, { status: 400 });
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Mã giảm giá đã hết lượt sử dụng" }, { status: 400 });
  }
  if (subtotal < coupon.minOrderAmount) {
    return NextResponse.json(
      { error: `Đơn hàng tối thiểu ${coupon.minOrderAmount.toLocaleString("vi-VN")}đ để dùng mã này` },
      { status: 400 }
    );
  }

  const discountAmount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);

  return NextResponse.json({ code: coupon.code, discountAmount });
}
