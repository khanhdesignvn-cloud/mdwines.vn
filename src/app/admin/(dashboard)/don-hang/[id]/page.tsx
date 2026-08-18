import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVND, formatDateTime } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { PaymentStatusToggle } from "@/components/admin/PaymentStatusToggle";
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, PAYMENT_STATUS_COLOR } from "@/lib/order-status";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/don-hang/[id]">) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/don-hang" className="text-sm text-wine-700 hover:underline">
        ← Danh sách đơn hàng
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-ink-900">Đơn hàng {order.orderCode}</h1>
          <p className="mt-1 text-sm text-ink-700/60">Đặt lúc {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-700/60">Trạng thái:</span>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
          <h2 className="font-serif text-lg text-ink-900">Sản phẩm</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-ink-900/5 pb-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{item.productName}</p>
                  <p className="text-xs text-ink-700/60">{formatVND(item.price)} × {item.quantity}</p>
                </div>
                <p className="font-medium text-wine-800">{formatVND(item.total)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm text-ink-700/80">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatVND(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>-{formatVND(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink-900/10 pt-3 font-serif text-lg text-wine-800">
            <span>Tổng cộng</span>
            <span>{formatVND(order.total)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
            <h2 className="font-serif text-lg text-ink-900">Khách hàng</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-ink-700/60">Họ tên</dt>
                <dd className="font-medium text-ink-900">{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-ink-700/60">Điện thoại</dt>
                <dd className="font-medium text-ink-900">{order.customerPhone}</dd>
              </div>
              {order.customerEmail && (
                <div>
                  <dt className="text-ink-700/60">Email</dt>
                  <dd className="font-medium text-ink-900">{order.customerEmail}</dd>
                </div>
              )}
              <div>
                <dt className="text-ink-700/60">Địa chỉ giao hàng</dt>
                <dd className="font-medium text-ink-900">{order.customerAddress}</dd>
              </div>
              <div>
                <dt className="text-ink-700/60">Phương thức thanh toán</dt>
                <dd className="font-medium text-ink-900">{PAYMENT_METHOD_LABEL[order.paymentMethod]}</dd>
              </div>
              <div>
                <dt className="text-ink-700/60">Trạng thái thanh toán</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${PAYMENT_STATUS_COLOR[order.paymentStatus]}`}>
                    {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                  </span>
                  {order.paymentMethod !== "vnpay" && (
                    <PaymentStatusToggle orderId={order.id} paymentStatus={order.paymentStatus} />
                  )}
                </dd>
              </div>
              {order.note && (
                <div>
                  <dt className="text-ink-700/60">Ghi chú</dt>
                  <dd className="font-medium text-ink-900">{order.note}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
