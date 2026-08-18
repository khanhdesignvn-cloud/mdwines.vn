import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVND, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Tổng quan quản trị" };

const STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-purple-100 text-purple-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const [orderCount, revenueAgg, productCount, lowStock, recentOrders, statusCounts, topItems] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "cancelled" } },
      }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 10 }, status: "active" },
        orderBy: { stock: "asc" },
        take: 5,
        include: { category: true },
      }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.orderItem.groupBy({
        by: ["productName"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const statusMap = new Map(statusCounts.map((s) => [s.status, s._count._all]));

  const stats = [
    { label: "Tổng doanh thu", value: formatVND(revenueAgg._sum.total ?? 0) },
    { label: "Tổng đơn hàng", value: orderCount.toString() },
    { label: "Sản phẩm đang bán", value: productCount.toString() },
    { label: "Chờ xác nhận", value: (statusMap.get("pending") ?? 0).toString() },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Tổng quan</h1>
      <p className="mt-1 text-sm text-ink-700/60">Chào mừng quay lại, đây là tình hình kinh doanh hôm nay.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink-900/10 bg-cream-50 p-5">
            <p className="text-xs text-ink-700/60">{s.label}</p>
            <p className="mt-2 font-serif text-2xl text-wine-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg text-ink-900">Đơn hàng gần đây</h2>
            <Link href="/admin/don-hang" className="text-sm text-wine-700 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-ink-700/60">
                  <th className="pb-2 font-normal">Mã đơn</th>
                  <th className="pb-2 font-normal">Khách hàng</th>
                  <th className="pb-2 font-normal">Ngày</th>
                  <th className="pb-2 font-normal">Trạng thái</th>
                  <th className="pb-2 font-normal text-right">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-ink-900/5">
                    <td className="py-2.5">
                      <Link href={`/admin/don-hang/${o.id}`} className="font-medium text-wine-700 hover:underline">
                        {o.orderCode}
                      </Link>
                    </td>
                    <td className="py-2.5">{o.customerName}</td>
                    <td className="py-2.5 text-ink-700/70">{formatDateTime(o.createdAt)}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLOR[o.status]}`}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-medium">{formatVND(o.total)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-ink-700/50">
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-lg text-ink-900">Sản phẩm bán chạy</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {topItems.map((item) => (
                <li key={item.productName} className="flex items-center justify-between">
                  <span className="line-clamp-1 pr-2 text-ink-800">{item.productName}</span>
                  <span className="shrink-0 text-ink-700/60">{item._sum.quantity} chai</span>
                </li>
              ))}
              {topItems.length === 0 && <p className="text-ink-700/50">Chưa có dữ liệu bán hàng.</p>}
            </ul>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
            <h2 className="font-serif text-lg text-red-800">⚠ Sắp hết hàng</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <Link href={`/admin/san-pham/${p.id}`} className="line-clamp-1 pr-2 text-ink-800 hover:text-wine-700">
                    {p.name}
                  </Link>
                  <span className="shrink-0 font-semibold text-red-700">{p.stock} còn lại</span>
                </li>
              ))}
              {lowStock.length === 0 && <p className="text-ink-700/50">Tồn kho ổn định.</p>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
