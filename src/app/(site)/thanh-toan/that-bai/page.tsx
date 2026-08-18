import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Thanh toán không thành công" };

export default async function PaymentFailedPage({
  searchParams,
}: PageProps<"/thanh-toan/that-bai">) {
  const sp = await searchParams;
  const orderCode = typeof sp.orderCode === "string" ? sp.orderCode : undefined;

  return (
    <div className="container-lux max-w-xl py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-700">
        ✕
      </div>
      <h1 className="mt-5 font-serif text-3xl text-ink-900">Thanh toán không thành công</h1>
      <p className="mt-3 text-ink-700/70">
        Giao dịch VNPay chưa hoàn tất hoặc đã bị hủy.
        {orderCode && (
          <>
            {" "}
            Mã đơn hàng liên quan: <strong>{orderCode}</strong>.
          </>
        )}{" "}
        Đơn hàng của bạn vẫn được ghi nhận — bạn có thể liên hệ MDWines Cellar để thanh toán bằng
        phương thức khác, hoặc thử lại.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/tra-cuu-don-hang"
          className="rounded-full bg-wine-800 px-7 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700"
        >
          Tra cứu đơn hàng
        </Link>
        <Link
          href="/lien-he"
          className="rounded-full border border-wine-800 px-7 py-3 text-sm font-semibold text-wine-800 hover:bg-wine-800 hover:text-cream-50"
        >
          Liên hệ hỗ trợ
        </Link>
      </div>
    </div>
  );
}
