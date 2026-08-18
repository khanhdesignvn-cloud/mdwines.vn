import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = couponSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const code = data.code.toUpperCase();

  const owner = await prisma.coupon.findUnique({ where: { code } });
  if (owner && owner.id !== id) {
    return NextResponse.json({ error: "Mã này đã tồn tại" }, { status: 400 });
  }

  await prisma.coupon.update({
    where: { id },
    data: {
      code,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount,
      maxUses: data.maxUses ?? null,
      active: data.active,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
