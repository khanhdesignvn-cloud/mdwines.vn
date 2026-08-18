import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.union([
  z.object({ status: z.enum(["pending", "confirmed", "shipping", "completed", "cancelled"]) }),
  z.object({ paymentStatus: z.enum(["unpaid", "paid", "failed"]) }),
]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
  }

  if ("paymentStatus" in parsed.data) {
    await prisma.order.update({ where: { id }, data: { paymentStatus: parsed.data.paymentStatus } });
    return NextResponse.json({ ok: true });
  }

  const nextStatus = parsed.data.status;

  // Restock items if an order is cancelled after being placed.
  if (nextStatus === "cancelled" && order.status !== "cancelled") {
    await prisma.$transaction([
      ...order.items
        .filter((i) => i.productId)
        .map((i) =>
          prisma.product.update({
            where: { id: i.productId! },
            data: { stock: { increment: i.quantity } },
          })
        ),
      prisma.order.update({ where: { id }, data: { status: nextStatus } }),
    ]);
  } else {
    await prisma.order.update({ where: { id }, data: { status: nextStatus } });
  }

  return NextResponse.json({ ok: true });
}
