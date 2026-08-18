"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("sent");
          }}
          className="space-y-4"
        >
          <h2 className="font-serif text-lg text-wine-800">Gửi yêu cầu tư vấn</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Họ và tên *"
              className="rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
            <input
              required
              placeholder="Số điện thoại *"
              className="rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
          />
          <textarea
            required
            rows={4}
            placeholder="Nội dung cần tư vấn *"
            className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-wine-800 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700"
          >
            Gửi yêu cầu
          </button>
        </form>
      )}
    </div>
  );
}
