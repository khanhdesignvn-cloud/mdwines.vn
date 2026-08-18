import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isHttpsRequest } from "@/lib/auth";
import {
  CUSTOMER_SESSION_COOKIE,
  CUSTOMER_SESSION_MAX_AGE,
  createCustomerSessionToken,
} from "@/lib/customer-auth";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  email: z.string().trim().email("Email không hợp lệ"),
  phone: z.string().trim().min(9, "Số điện thoại không hợp lệ").max(15).optional().or(z.literal("")),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(100),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const { name, phone, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email này đã được đăng ký" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email, phone: phone || null, passwordHash },
  });

  const token = await createCustomerSessionToken({
    sub: customer.id,
    email: customer.email,
    name: customer.name,
  });

  const response = NextResponse.json({ ok: true }, { status: 201 });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isHttpsRequest(request),
    sameSite: "lax",
    path: "/",
    maxAge: CUSTOMER_SESSION_MAX_AGE,
  });
  return response;
}
