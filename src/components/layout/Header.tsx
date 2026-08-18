"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type NavCategory = { slug: string; name: string };

export function Header({ categories }: { categories: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isHydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-ink-900 text-cream-100 shadow-lg shadow-black/20">
      <div className="bg-wine-950 text-gold-200 text-xs tracking-wide">
        <div className="container-lux flex items-center justify-between py-2">
          <p className="hidden sm:block">
            Miễn phí giao hàng nội thành cho đơn từ 2.000.000₫ · Hotline tư vấn: 1900 6868
          </p>
          <p className="sm:hidden">Hotline: 1900 6868</p>
          <div className="flex items-center gap-4">
            <Link href="/lien-he" className="hover:text-gold-100">
              Liên hệ
            </Link>
            <Link href="/su-kien" className="hover:text-gold-100">
              Sự kiện
            </Link>
          </div>
        </div>
      </div>

      <div className="container-lux flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400 text-gold-300 font-serif text-lg">
            MD
          </span>
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-gold-gradient">
            MDWines Cellar
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <Link href="/san-pham" className="hover:text-gold-300 transition-colors">
            Tất cả sản phẩm
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?category=${c.slug}`}
              className="hover:text-gold-300 transition-colors"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/gioi-thieu" className="hover:text-gold-300 transition-colors">
            Giới thiệu
          </Link>
          <Link href="/tin-tuc" className="hover:text-gold-300 transition-colors">
            Tin tức
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/gio-hang"
            className="relative flex items-center gap-2 rounded-full border border-gold-400/60 px-4 py-2 text-sm hover:bg-gold-400/10 transition-colors"
          >
            <CartIcon />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {isHydrated && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[11px] font-bold text-ink-900">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Mở menu"
            className="lg:hidden text-cream-100"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="lg:hidden border-t border-white/10 bg-ink-900">
          <div className="container-lux flex flex-col py-3 text-sm">
            <Link href="/san-pham" className="py-2" onClick={() => setMenuOpen(false)}>
              Tất cả sản phẩm
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/san-pham?category=${c.slug}`}
                className="py-2"
                onClick={() => setMenuOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <Link href="/gioi-thieu" className="py-2" onClick={() => setMenuOpen(false)}>
              Giới thiệu
            </Link>
            <Link href="/tin-tuc" className="py-2" onClick={() => setMenuOpen(false)}>
              Tin tức
            </Link>
            <Link href="/su-kien" className="py-2" onClick={() => setMenuOpen(false)}>
              Sự kiện
            </Link>
            <Link href="/lien-he" className="py-2" onClick={() => setMenuOpen(false)}>
              Liên hệ
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      )}
    </svg>
  );
}
