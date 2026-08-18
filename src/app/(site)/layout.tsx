import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true },
  });

  return (
    <CartProvider>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
