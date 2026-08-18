"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PaymentStatusToggle({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function markPaid() {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "paid" }),
    });
    if (res.ok) router.refresh();
    setSaving(false);
  }

  if (paymentStatus === "paid") return null;

  return (
    <button
      onClick={markPaid}
      disabled={saving}
      className="text-xs font-semibold text-wine-700 hover:underline disabled:opacity-60"
    >
      {saving ? "..." : "Đánh dấu đã thanh toán"}
    </button>
  );
}
