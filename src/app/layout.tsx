import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MDWines Cellar – Rượu vang nhập khẩu cao cấp",
    template: "%s | MDWines Cellar",
  },
  description:
    "MDWines Cellar - Nhà nhập khẩu và phân phối rượu vang cao cấp từ Pháp, Ý, Chile, Úc và nhiều quốc gia khác. Giao hàng toàn quốc, tư vấn chuyên sâu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${beVietnam.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-100 text-ink-900">{children}</body>
    </html>
  );
}
