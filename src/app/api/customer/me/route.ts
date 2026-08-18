import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

const updateSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(120),
  phone: z.string().trim().max(15).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  return NextResponse.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  });
}

export async function PATCH(request: Request) {
  const customer = await getCurrentCustomer();
  if (!customer) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
      { status: 400 }
    );
  }

  const data = parsed.data;
  await prisma.customer.update({
    where: { id: customer.id },
    data: { name: data.name, phone: data.phone || null, address: data.address || null },
  });

  return NextResponse.json({ ok: true });
}
