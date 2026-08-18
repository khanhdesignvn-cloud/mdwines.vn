import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/order-status";

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Đơn hàng");

  sheet.columns = [
    { header: "Mã đơn", key: "orderCode", width: 22 },
    { header: "Ngày đặt", key: "createdAt", width: 20 },
    { header: "Khách hàng", key: "customerName", width: 24 },
    { header: "Điện thoại", key: "customerPhone", width: 16 },
    { header: "Địa chỉ", key: "customerAddress", width: 36 },
    { header: "Trạng thái", key: "status", width: 16 },
    { header: "Phương thức TT", key: "paymentMethod", width: 18 },
    { header: "TT thanh toán", key: "paymentStatus", width: 16 },
    { header: "Mã giảm giá", key: "couponCode", width: 14 },
    { header: "Tạm tính", key: "subtotal", width: 14 },
    { header: "Giảm giá", key: "discountAmount", width: 12 },
    { header: "Phí ship", key: "shippingFee", width: 12 },
    { header: "Tổng cộng", key: "total", width: 14 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const o of orders) {
    sheet.addRow({
      orderCode: o.orderCode,
      createdAt: o.createdAt.toLocaleString("vi-VN"),
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerAddress: o.customerAddress,
      status: ORDER_STATUS_LABEL[o.status] ?? o.status,
      paymentMethod: PAYMENT_METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod,
      paymentStatus: PAYMENT_STATUS_LABEL[o.paymentStatus] ?? o.paymentStatus,
      couponCode: o.couponCode ?? "",
      subtotal: o.subtotal,
      discountAmount: o.discountAmount,
      shippingFee: o.shippingFee,
      total: o.total,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `don-hang-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
