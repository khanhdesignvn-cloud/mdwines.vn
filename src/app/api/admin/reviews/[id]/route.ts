import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: "Không tìm thấy đánh giá" }, { status: 404 });
  }

  await prisma.review.delete({ where: { id } });

  const agg = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
  });
  if (agg._avg.rating !== null) {
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: agg._avg.rating },
    });
  }

  return NextResponse.json({ ok: true });
}
