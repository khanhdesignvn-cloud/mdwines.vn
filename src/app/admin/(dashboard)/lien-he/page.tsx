import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ContactInbox } from "@/components/admin/ContactInbox";

export const metadata: Metadata = { title: "Liên hệ khách hàng" };

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const pendingCount = messages.filter((m) => !m.handled).length;

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Liên hệ khách hàng</h1>
      <p className="mt-1 text-sm text-ink-700/60">
        {messages.length} yêu cầu · {pendingCount} chưa xử lý
      </p>

      <div className="mt-6">
        <ContactInbox messages={messages} />
      </div>
    </div>
  );
}
