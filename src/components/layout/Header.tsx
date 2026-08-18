"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

type NavCategory = { slug: string; name: string };

export function Header({
  categories,
  customerName,
}: {
  categories: NavCategory[];
  customerName: string | null;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, isHydrated } = useCart();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-ink-900 text-cream-100 transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/25 backdrop-blur-sm" : "shadow-md shadow-black/10"
      }`}
    >
      <div
        className={`overflow-hidden bg-wine-950 text-gold-200 text-xs tracking-wide transition-[max-height,opacity] duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
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

      <div
        className={`container-lux flex items-center justify-between transition-[padding] duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400 text-gold-300 font-serif text-lg">
            MD
          </span>
          <span className="font-serif text-xl sm:text-2xl tracking-wide text-gold-gradient">
            MDWines Cellar
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <Link href="/san-pham" className="relative py-1 transition-colors hover:text-gold-300 nav-underline">
            Tất cả sản phẩm
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?category=${c.slug}`}
              className="relative py-1 transition-colors hover:text-gold-300 nav-underline"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/gioi-thieu" className="relative py-1 transition-colors hover:text-gold-300 nav-underline">
            Giới thiệu
          </Link>
          <Link href="/tin-tuc" className="relative py-1 transition-colors hover:text-gold-300 nav-underline">
            Tin tức
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={customerName ? "/tai-khoan" : "/dang-nhap"}
            className="hidden items-center gap-2 text-sm transition-colors hover:text-gold-300 sm:flex"
          >
            <AccountIcon />
            {customerName ? customerName.split(" ").pop() : "Đăng nhập"}
          </Link>
          <Link
            href="/gio-hang"
            className="relative flex items-center gap-2 rounded-full border border-gold-400/60 px-4 py-2 text-sm transition-colors hover:bg-gold-400/10"
          >
            <CartIcon />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {isHydrated && itemCount > 0 && (
              <span
                key={itemCount}
                className="animate-badge-pop absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-[11px] font-bold text-ink-900"
              >
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
        <nav className="lg:hidden border-t border-white/10 bg-ink-900 animate-fade-up">
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
            <Link
              href={customerName ? "/tai-khoan" : "/dang-nhap"}
              className="py-2"
              onClick={() => setMenuOpen(false)}
            >
              {customerName ? `Tài khoản (${customerName})` : "Đăng nhập / Đăng ký"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function AccountIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
    </svg>
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
