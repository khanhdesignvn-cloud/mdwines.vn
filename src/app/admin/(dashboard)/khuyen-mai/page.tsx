import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CouponManager } from "@/components/admin/CouponManager";

export const metadata: Metadata = { title: "Mã giảm giá" };

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-2xl text-ink-900">Mã giảm giá</h1>
      <p className="mt-1 text-sm text-ink-700/60">Quản lý chương trình khuyến mãi cho khách hàng.</p>
      <div className="mt-6 max-w-3xl">
        <CouponManager coupons={coupons} />
      </div>
    </div>
  );
}
