import crypto from "crypto";
import querystring from "querystring";

export function isVnpayConfigured() {
  return Boolean(process.env.VNPAY_TMN_CODE && process.env.VNPAY_HASH_SECRET);
}

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj)
    .map((key) => encodeURIComponent(key))
    .sort();
  for (const key of keys) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

function vnpCreateDate(date: Date) {
  // VNPay expects yyyyMMddHHmmss in GMT+7 (Vietnam time).
  const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${vnTime.getUTCFullYear()}${pad(vnTime.getUTCMonth() + 1)}${pad(vnTime.getUTCDate())}${pad(
    vnTime.getUTCHours()
  )}${pad(vnTime.getUTCMinutes())}${pad(vnTime.getUTCSeconds())}`;
}

export function createVnpayPaymentUrl(params: {
  orderCode: string;
  amount: number; // VND, whole number
  orderInfo: string;
  ipAddr: string;
  returnUrl: string;
}) {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  if (!tmnCode || !secretKey) {
    throw new Error("VNPay chưa được cấu hình (thiếu VNPAY_TMN_CODE/VNPAY_HASH_SECRET)");
  }

  const now = new Date();
  const vnpParams: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: params.orderCode,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: String(params.amount * 100),
    vnp_ReturnUrl: params.returnUrl,
    vnp_IpAddr: params.ipAddr,
    vnp_CreateDate: vnpCreateDate(now),
  };

  const sorted = sortObject(vnpParams);
  const signData = querystring.stringify(sorted, undefined, undefined, { encodeURIComponent: (v) => v });
  const secureHash = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, "utf-8")).digest("hex");

  const query = querystring.stringify(
    { ...sorted, vnp_SecureHash: secureHash },
    undefined,
    undefined,
    { encodeURIComponent: (v) => v }
  );

  return `${vnpUrl}?${query}`;
}

export function verifyVnpaySignature(rawParams: Record<string, string>) {
  const secretKey = process.env.VNPAY_HASH_SECRET;
  if (!secretKey) return false;

  const params = { ...rawParams };
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = sortObject(params);
  const signData = querystring.stringify(sorted, undefined, undefined, { encodeURIComponent: (v) => v });
  const expectedHash = crypto.createHmac("sha512", secretKey).update(Buffer.from(signData, "utf-8")).digest("hex");

  return secureHash === expectedHash;
}
