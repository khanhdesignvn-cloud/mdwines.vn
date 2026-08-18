import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyVnpaySignature } from "@/lib/vnpay";

// Server-to-server notification VNPay calls directly — the authoritative
// source of truth for payment confirmation (unlike the browser return URL,
// which the user could close before it loads). Response shape is dictated
// by VNPay's spec: { RspCode, Message }.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  if (!verifyVnpaySignature(params)) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const orderCode = params.vnp_TxnRef;
  const order = orderCode ? await prisma.order.findUnique({ where: { orderCode } }) : null;
  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  if (Number(params.vnp_Amount) !== order.total * 100) {
    return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
  }

  const success = params.vnp_ResponseCode === "00";
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: success ? "paid" : "failed" },
  });

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
