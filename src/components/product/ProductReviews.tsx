"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDateTime } from "@/lib/format";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  customer: { name: string };
};

export function ProductReviews({
  productId,
  productSlug,
  reviews,
  isLoggedIn,
  myReview,
}: {
  productId: string;
  productSlug: string;
  reviews: ReviewRow[];
  isLoggedIn: boolean;
  myReview: { rating: number; comment: string | null } | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(myReview?.rating ?? 5);
  const [comment, setComment] = useState(myReview?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể gửi đánh giá");
        setSubmitting(false);
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ");
    } finally {
      setSubmitting(false);
    }
  }

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink-900">Đánh giá từ khách hàng</h2>
        {average !== null && (
          <p className="text-sm text-gold-500">
            {"★".repeat(Math.round(average))}
            {"☆".repeat(5 - Math.round(average))}{" "}
            <span className="text-ink-700/60">
              {average.toFixed(1)}/5 ({reviews.length} đánh giá)
            </span>
          </p>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {reviews.length === 0 && <p className="text-sm text-ink-700/60">Chưa có đánh giá nào.</p>}
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-ink-900/10 pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-ink-900">{r.customer.name}</p>
              <p className="text-xs text-ink-700/50">{formatDateTime(r.createdAt)}</p>
            </div>
            <p className="text-sm text-gold-500">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </p>
            {r.comment && <p className="mt-1 text-sm text-ink-800/85">{r.comment}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-ink-900/10 pt-5">
        {!isLoggedIn ? (
          <p className="text-sm text-ink-700/70">
            <Link href={`/dang-nhap?next=/san-pham/${productSlug}`} className="font-semibold text-wine-700 hover:underline">
              Đăng nhập
            </Link>{" "}
            để để lại đánh giá cho sản phẩm này.
          </p>
        ) : done || myReview ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-ink-700/70">Đánh giá của bạn:</p>
            <div className="flex gap-1 text-2xl text-gold-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  {n <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Cập nhật nhận xét..."
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-wine-800 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Cập nhật đánh giá"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm text-ink-700/70">Để lại đánh giá của bạn:</p>
            <div className="flex gap-1 text-2xl text-gold-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  {n <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Chia sẻ cảm nhận của bạn..."
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none"
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-wine-800 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
