import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createVnpayPaymentUrl, isVnpayConfigured } from "@/lib/vnpay";

const schema = z.object({ orderCode: z.string().min(1) });

export async function POST(request: Request) {
  if (!isVnpayConfigured()) {
    return NextResponse.json(
      { error: "Thanh toán VNPay chưa được cấu hình trên hệ thống. Vui lòng chọn phương thức khác." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { orderCode: parsed.data.orderCode } });
  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng" }, { status: 404 });
  }
  if (order.paymentMethod !== "vnpay") {
    return NextResponse.json({ error: "Đơn hàng này không dùng phương thức VNPay" }, { status: 400 });
  }
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ error: "Đơn hàng đã được thanh toán" }, { status: 400 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ipAddr = forwardedFor?.split(",")[0].trim() || "127.0.0.1";
  const origin = new URL(request.url).origin;

  try {
    const paymentUrl = createVnpayPaymentUrl({
      orderCode: order.orderCode,
      amount: order.total,
      orderInfo: `Thanh toan don hang ${order.orderCode}`,
      ipAddr,
      returnUrl: `${origin}/api/payment/vnpay/return`,
    });
    return NextResponse.json({ paymentUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Không thể khởi tạo thanh toán";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
