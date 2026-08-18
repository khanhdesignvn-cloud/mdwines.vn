"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          phone: String(form.get("phone") || ""),
          email: String(form.get("email") || ""),
          message: String(form.get("message") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể gửi yêu cầu");
        setSubmitting(false);
        return;
      }
      setStatus("sent");
    } catch {
      setError("Không thể kết nối máy chủ");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
      {status === "sent" ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-wine-800 text-xl text-cream-50">
            ✓
          </div>
          <h2 className="mt-4 font-serif text-xl text-ink-900">Cảm ơn bạn đã liên hệ!</h2>
          <p className="mt-2 text-sm text-ink-700/70">
            Đội ngũ MDWines Cellar sẽ phản hồi trong vòng 24 giờ làm việc.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-serif text-lg text-wine-800">Gửi yêu cầu tư vấn</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Họ và tên *"
              className="rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
            <input
              name="phone"
              required
              placeholder="Số điện thoại *"
              className="rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
          />
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Nội dung cần tư vấn *"
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-wine-800 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
          >
            {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      )}
    </div>
  );
}
