import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { prisma } from "@/lib/prisma";
import { formatVND, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/order-status";
import { ProfileForm } from "@/components/account/ProfileForm";
import { LogoutButton } from "@/components/account/LogoutButton";

export const metadata: Metadata = { title: "Tài khoản của tôi" };

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/dang-nhap?next=/tai-khoan");

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="container-lux py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-wine-700">TÀI KHOẢN</p>
          <h1 className="mt-2 font-serif text-3xl text-ink-900">Xin chào, {customer.name}</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="h-fit rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <h2 className="font-serif text-lg text-ink-900">Thông tin cá nhân</h2>
          <div className="mt-4">
            <ProfileForm customer={customer} />
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-serif text-lg text-ink-900">Lịch sử đơn hàng</h2>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-900/15 py-16 text-center text-ink-700/50">
              Bạn chưa có đơn hàng nào.
              <div className="mt-4">
                <Link href="/san-pham" className="text-wine-700 hover:underline">
                  Khám phá sản phẩm →
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-ink-900/10 bg-cream-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-serif text-wine-800">{order.orderCode}</p>
                      <p className="text-xs text-ink-700/60">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${ORDER_STATUS_COLOR[order.status]}`}
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1 border-t border-ink-900/10 pt-3 text-sm text-ink-700/80">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.productName} × {item.quantity}</span>
                        <span>{formatVND(item.total)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-ink-900/10 pt-3 font-serif text-wine-800">
                    <span>Tổng cộng</span>
                    <span>{formatVND(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
