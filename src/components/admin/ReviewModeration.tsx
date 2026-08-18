"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/format";

type ReviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string | Date;
  product: { name: string; slug: string };
  customer: { name: string; email: string };
};

export function ReviewModeration({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Xóa đánh giá này?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) router.refresh();
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 py-16 text-center text-ink-700/50">
        Chưa có đánh giá nào.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-ink-900/10 bg-cream-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">{r.product.name}</p>
              <p className="text-xs text-ink-700/60">
                {r.customer.name} ({r.customer.email}) · {formatDateTime(r.createdAt)}
              </p>
              <p className="mt-1 text-gold-500 text-sm">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </p>
            </div>
            <button
              disabled={busyId === r.id}
              onClick={() => handleDelete(r.id)}
              className="rounded-full border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Xóa
            </button>
          </div>
          {r.comment && <p className="mt-3 text-sm text-ink-800/85">{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}
