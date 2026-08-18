"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ContactMessage } from "@prisma/client";
import { formatDateTime } from "@/lib/format";

export function ContactInbox({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggleHandled(id: string, handled: boolean) {
    setBusyId(id);
    await fetch(`/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Xóa liên hệ này?")) return;
    setBusyId(id);
    await fetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 py-16 text-center text-ink-700/50">
        Chưa có yêu cầu liên hệ nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <div
          key={m.id}
          className={`rounded-2xl border p-5 ${
            m.handled ? "border-ink-900/10 bg-cream-50" : "border-gold-400/50 bg-gold-100/30"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink-900">
                {m.name} <span className="font-normal text-ink-700/60">· {m.phone}</span>
              </p>
              {m.email && <p className="text-xs text-ink-700/60">{m.email}</p>}
              <p className="mt-1 text-xs text-ink-700/50">{formatDateTime(m.createdAt)}</p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={busyId === m.id}
                onClick={() => toggleHandled(m.id, !m.handled)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  m.handled
                    ? "border border-ink-900/15 text-ink-700"
                    : "bg-wine-800 text-cream-50"
                }`}
              >
                {m.handled ? "Đã xử lý" : "Đánh dấu đã xử lý"}
              </button>
              <button
                disabled={busyId === m.id}
                onClick={() => handleDelete(m.id)}
                className="rounded-full border border-red-300 px-3 py-1.5 text-xs text-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm text-ink-800/85">{m.message}</p>
        </div>
      ))}
    </div>
  );
}
