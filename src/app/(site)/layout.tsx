import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { prisma } from "@/lib/prisma";
import { getCurrentCustomer } from "@/lib/customer-auth";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [categories, customer] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
    getCurrentCustomer(),
  ]);

  return (
    <CartProvider>
      <Header categories={categories} customerName={customer?.name ?? null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
