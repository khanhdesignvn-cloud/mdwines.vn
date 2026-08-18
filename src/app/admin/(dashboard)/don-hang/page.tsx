import Link from "next/link";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatVND, formatDateTime } from "@/lib/format";
import {
  ORDER_STATUS_LABEL as STATUS_LABEL,
  ORDER_STATUS_COLOR as STATUS_COLOR,
  PAYMENT_METHOD_LABEL,
} from "@/lib/order-status";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

export default async function AdminOrderListPage({
  searchParams,
}: PageProps<"/admin/don-hang">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const status = typeof sp.status === "string" ? sp.status : undefined;

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { orderCode: { contains: q } },
      { customerName: { contains: q } },
      { customerPhone: { contains: q } },
    ];
  }

  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: "desc" } });

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { q, status, ...overrides };
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const qs = params.toString();
    return qs ? `/admin/don-hang?${qs}` : "/admin/don-hang";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink-900">Quản lý đơn hàng</h1>
          <p className="mt-1 text-sm text-ink-700/60">{orders.length} đơn hàng</p>
        </div>
        <a
          href="/api/admin/export/orders"
          className="rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-cream-200"
        >
          Xuất Excel
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form action="/admin/don-hang">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            className="w-72 rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2 text-sm focus:border-wine-700 focus:outline-none"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ status: undefined })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${!status ? "bg-wine-800 text-cream-50" : "bg-cream-50 text-ink-700 border border-ink-900/10"}`}
          >
            Tất cả
          </Link>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <Link
              key={value}
              href={buildHref({ status: value })}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${status === value ? "bg-wine-800 text-cream-50" : "bg-cream-50 text-ink-700 border border-ink-900/10"}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-900/10 bg-cream-50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-cream-200/60 text-left text-xs uppercase tracking-wide text-ink-700/60">
              <th className="px-4 py-3 font-medium">Mã đơn</th>
              <th className="px-4 py-3 font-medium">Khách hàng</th>
              <th className="px-4 py-3 font-medium">Ngày đặt</th>
              <th className="px-4 py-3 font-medium">Thanh toán</th>
              <th className="px-4 py-3 font-medium text-right">Tổng tiền</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-ink-900/5 hover:bg-cream-100">
                <td className="px-4 py-3 font-medium text-ink-900">{o.orderCode}</td>
                <td className="px-4 py-3">
                  <p className="text-ink-900">{o.customerName}</p>
                  <p className="text-xs text-ink-700/60">{o.customerPhone}</p>
                </td>
                <td className="px-4 py-3 text-ink-700/70">{formatDateTime(o.createdAt)}</td>
                <td className="px-4 py-3 text-ink-700/70">
                  {PAYMENT_METHOD_LABEL[o.paymentMethod]}
                </td>
                <td className="px-4 py-3 text-right font-medium">{formatVND(o.total)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[o.status]}`}>
                    {STATUS_LABEL[o.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/don-hang/${o.id}`} className="text-wine-700 hover:underline">
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-700/50">
                  Không có đơn hàng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
