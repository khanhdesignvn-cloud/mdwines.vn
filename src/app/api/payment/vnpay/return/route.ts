import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyVnpaySignature } from "@/lib/vnpay";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const orderCode = params.vnp_TxnRef;
  const failureUrl = new URL("/thanh-toan/that-bai", url.origin);
  if (orderCode) failureUrl.searchParams.set("orderCode", orderCode);

  if (!orderCode || !verifyVnpaySignature(params)) {
    failureUrl.searchParams.set("reason", "invalid_signature");
    return NextResponse.redirect(failureUrl);
  }

  const order = await prisma.order.findUnique({ where: { orderCode } });
  if (!order) {
    failureUrl.searchParams.set("reason", "not_found");
    return NextResponse.redirect(failureUrl);
  }

  const amountMatches = Number(params.vnp_Amount) === order.total * 100;
  const success = params.vnp_ResponseCode === "00" && amountMatches;

  if (success && order.paymentStatus !== "paid") {
    await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "paid" } });
  }

  if (!success) {
    failureUrl.searchParams.set("reason", "declined");
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(new URL(`/don-hang-thanh-cong/${order.orderCode}`, url.origin));
}
