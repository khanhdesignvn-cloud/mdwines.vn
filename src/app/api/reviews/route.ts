import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Vui lòng đăng nhập để đánh giá" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { productId, rating, comment } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
  }

  const review = await prisma.review.upsert({
    where: { productId_customerId: { productId, customerId: customer.id } },
    update: { rating, comment: comment || null },
    create: { productId, customerId: customer.id, rating, comment: comment || null },
  });

  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: { rating: agg._avg.rating ?? product.rating },
  });

  return NextResponse.json({ id: review.id }, { status: 201 });
}
