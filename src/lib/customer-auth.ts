import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const CUSTOMER_SESSION_COOKIE = "mdw_customer_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  // Different subject namespace than admin tokens so an admin token can
  // never be replayed as a customer session or vice versa.
  return new TextEncoder().encode(`customer:${secret}`);
}

export type CustomerSessionPayload = {
  sub: string;
  email: string;
  name: string;
};

export async function createCustomerSessionToken(payload: CustomerSessionPayload) {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyCustomerSessionToken(
  token: string
): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.name !== "string") {
      return null;
    }
    return { sub: payload.sub, email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export const CUSTOMER_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

export async function getCurrentCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifyCustomerSessionToken(token);
  if (!session) return null;

  return prisma.customer.findUnique({ where: { id: session.sub } });
}
