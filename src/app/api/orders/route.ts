import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  customerPhone: z
    .string()
    .trim()
    .regex(/^[0-9+\s]{9,15}$/, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  customerAddress: z.string().trim().min(5, "Vui lòng nhập địa chỉ giao hàng").max(500),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["cod", "bank_transfer"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, "Giỏ hàng đang trống"),
});

function generateOrderCode() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `MDW${datePart}${randomPart}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = data.items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      const productMap = new Map(products.map((p) => [p.id, p]));

      let subtotal = 0;
      const itemsData = data.items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new Error(`Sản phẩm không tồn tại`);
        if (product.stock < item.quantity) {
          throw new Error(`Sản phẩm "${product.name}" không đủ tồn kho`);
        }
        const price = product.salePrice ?? product.price;
        const total = price * item.quantity;
        subtotal += total;
        return {
          productId: product.id,
          productName: product.name,
          price,
          quantity: item.quantity,
          total,
        };
      });

      const shippingFee = subtotal >= 2000000 || subtotal === 0 ? 0 : 50000;
      const total = subtotal + shippingFee;

      const created = await tx.order.create({
        data: {
          orderCode: generateOrderCode(),
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          customerAddress: data.customerAddress,
          note: data.note || null,
          paymentMethod: data.paymentMethod,
          subtotal,
          shippingFee,
          total,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return created;
    });

    return NextResponse.json({ orderCode: order.orderCode }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể tạo đơn hàng";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
