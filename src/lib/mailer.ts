import nodemailer from "nodemailer";
import type { Order, OrderItem } from "@prisma/client";
import { formatVND } from "@/lib/format";

let warnedMissingConfig = false;

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    if (!warnedMissingConfig) {
      console.warn(
        "[mailer] SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS not configured — emails will be skipped."
      );
      warnedMissingConfig = true;
    }
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

type OrderWithItems = Order & { items: OrderItem[] };

function renderOrderItemsHtml(items: OrderItem[]) {
  return items
    .map(
      (item) =>
        `<tr><td style="padding:4px 8px;">${item.productName} × ${item.quantity}</td><td style="padding:4px 8px;text-align:right;">${formatVND(item.total)}</td></tr>`
    )
    .join("");
}

export async function sendOrderNotificationEmails(order: OrderWithItems) {
  const transporter = getTransporter();
  if (!transporter) return;

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const itemsHtml = renderOrderItemsHtml(order.items);

  const summaryHtml = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#591524;">MDWines Cellar</h2>
      <p>Mã đơn hàng: <strong>${order.orderCode}</strong></p>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
      <p style="margin-top:12px;">
        Tạm tính: ${formatVND(order.subtotal)}<br/>
        ${order.discountAmount > 0 ? `Giảm giá: -${formatVND(order.discountAmount)}<br/>` : ""}
        Phí vận chuyển: ${order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}<br/>
        <strong>Tổng cộng: ${formatVND(order.total)}</strong>
      </p>
      <p>Người nhận: ${order.customerName} — ${order.customerPhone}</p>
      <p>Địa chỉ: ${order.customerAddress}</p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  if (order.customerEmail) {
    tasks.push(
      transporter.sendMail({
        from: fromAddress,
        to: order.customerEmail,
        subject: `Xác nhận đơn hàng ${order.orderCode} — MDWines Cellar`,
        html: `<p>Cảm ơn bạn đã đặt hàng tại MDWines Cellar! Đơn hàng của bạn đã được ghi nhận.</p>${summaryHtml}`,
      })
    );
  }

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    tasks.push(
      transporter.sendMail({
        from: fromAddress,
        to: adminEmail,
        subject: `Đơn hàng mới: ${order.orderCode}`,
        html: `<p>Có đơn hàng mới cần xử lý.</p>${summaryHtml}`,
      })
    );
  }

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.error("[mailer] Failed to send order notification emails:", err);
  }
}
