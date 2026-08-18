import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ReviewModeration } from "@/components/admin/ReviewModeration";

export const metadata: Metadata = { title: "Đánh giá sản phẩm" };

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { name: true, slug: true } },
      customer: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Đánh giá sản phẩm</h1>
      <p className="mt-1 text-sm text-ink-700/60">{reviews.length} đánh giá từ khách hàng</p>
      <div className="mt-6 max-w-3xl">
        <ReviewModeration reviews={reviews} />
      </div>
    </div>
  );
}
