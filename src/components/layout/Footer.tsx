import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink-900 text-cream-200">
      <div className="container-lux grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400 text-gold-300 font-serif">
              MD
            </span>
            <span className="font-serif text-lg text-gold-gradient">MDWines Cellar</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream-300/80">
            Nhà nhập khẩu và phân phối rượu vang cao cấp, đồng hành cùng những khoảnh khắc
            thưởng thức sang trọng và đáng nhớ của người Việt.
          </p>
          <div className="mt-5 flex gap-3">
            {["FB", "IG", "YT"].map((s) => (
              <span
                key={s}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-xs text-cream-200/80"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-serif text-base text-gold-300 mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm text-cream-300/80">
            <li><Link href="/san-pham?category=vang-do" className="hover:text-gold-200">Vang đỏ</Link></li>
            <li><Link href="/san-pham?category=vang-trang" className="hover:text-gold-200">Vang trắng</Link></li>
            <li><Link href="/san-pham?category=vang-hong" className="hover:text-gold-200">Vang hồng</Link></li>
            <li><Link href="/san-pham?category=vang-no" className="hover:text-gold-200">Vang nổ &amp; Champagne</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base text-gold-300 mb-4">Về MDWines</h3>
          <ul className="space-y-2 text-sm text-cream-300/80">
            <li><Link href="/gioi-thieu" className="hover:text-gold-200">Giới thiệu</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-gold-200">Tin tức &amp; Kiến thức</Link></li>
            <li><Link href="/su-kien" className="hover:text-gold-200">Sự kiện thưởng rượu</Link></li>
            <li><Link href="/lien-he" className="hover:text-gold-200">Liên hệ</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold-200">Đăng nhập quản trị</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-base text-gold-300 mb-4">Liên hệ</h3>
          <ul className="space-y-2 text-sm text-cream-300/80">
            <li>Showroom: 88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</li>
            <li>Hotline: 1900 6868</li>
            <li>Email: cellar@mdwines.vn</li>
            <li>Giờ mở cửa: 9:00 – 21:00 (T2 – CN)</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-cream-300/60">
        © {new Date().getFullYear()} MDWines Cellar. Vui lòng uống có trách nhiệm — Không bán rượu bia cho người dưới 18 tuổi.
      </div>
    </footer>
  );
}
