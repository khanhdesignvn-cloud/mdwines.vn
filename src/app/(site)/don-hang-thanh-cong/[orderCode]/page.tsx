import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVND, formatDateTime } from "@/lib/format";
import { PAYMENT_METHOD_LABEL } from "@/lib/order-status";

export default async function OrderSuccessPage({
  params,
}: PageProps<"/don-hang-thanh-cong/[orderCode]">) {
  const { orderCode } = await params;
  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container-lux max-w-2xl py-16">
      <div className="rounded-3xl border border-gold-400/40 bg-cream-50 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-wine-800 text-2xl text-cream-50">
          ✓
        </div>
        <h1 className="mt-5 font-serif text-3xl text-ink-900">Đặt hàng thành công!</h1>
        <p className="mt-2 text-ink-700/70">
          Cảm ơn bạn đã tin tưởng MDWines Cellar. Chúng tôi sẽ liên hệ xác nhận đơn hàng trong
          thời gian sớm nhất.
        </p>
        <p className="mt-4 font-serif text-xl text-wine-800">Mã đơn hàng: {order.orderCode}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
        <div className="flex justify-between text-sm text-ink-700/70">
          <span>Ngày đặt</span>
          <span>{formatDateTime(order.createdAt)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink-700/70">
          <span>Người nhận</span>
          <span>{order.customerName} · {order.customerPhone}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink-700/70">
          <span>Địa chỉ</span>
          <span className="text-right max-w-xs">{order.customerAddress}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-ink-700/70">
          <span>Thanh toán</span>
          <span>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span>
        </div>

        <div className="mt-5 space-y-2 border-t border-ink-900/10 pt-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.productName} × {item.quantity}</span>
              <span>{formatVND(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1 border-t border-ink-900/10 pt-3 text-sm text-ink-700/70">
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

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/san-pham"
          className="inline-block rounded-full bg-wine-800 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700"
        >
          Tiếp tục mua sắm
        </Link>
        <Link
          href="/tra-cuu-don-hang"
          className="inline-block rounded-full border border-wine-800 px-7 py-3 text-sm font-semibold text-wine-800 hover:bg-wine-800 hover:text-cream-50"
        >
          Tra cứu đơn hàng sau
        </Link>
      </div>
    </div>
  );
}
