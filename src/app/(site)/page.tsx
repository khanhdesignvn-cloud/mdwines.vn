import Link from "next/link";
import { getCategories, getCountries, getNewsPosts, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { WineBottleArt } from "@/components/product/WineBottleArt";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const [featured, categories, countries, news] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 8 }),
    getCategories(),
    getCountries(),
    getNewsPosts(3),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-cream-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,75,0.15),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(140,25,47,0.35),transparent_50%)]" />
        <div className="container-lux relative grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <p className="mb-4 inline-block rounded-full border border-gold-400/50 px-4 py-1 text-xs tracking-[0.2em] text-gold-300">
              NHÀ NHẬP KHẨU RƯỢU VANG CAO CẤP
            </p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Nghệ thuật thưởng <span className="text-gold-gradient">rượu vang</span> đỉnh cao
            </h1>
            <p className="mt-6 max-w-lg text-cream-300/85 leading-relaxed">
              MDWines Cellar tuyển chọn những chai vang danh giá từ các vùng trồng nho lừng
              danh thế giới — Bordeaux, Tuscany, Napa Valley, Mendoza — mang đến trải nghiệm
              thưởng thức đẳng cấp cho mọi khoảnh khắc quan trọng.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/san-pham"
                className="rounded-full bg-gold-400 px-7 py-3 text-sm font-semibold text-ink-900 transition-transform hover:scale-105"
              >
                Khám phá bộ sưu tập
              </Link>
              <Link
                href="/gioi-thieu"
                className="rounded-full border border-cream-100/30 px-7 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-white/10"
              >
                Câu chuyện MDWines
              </Link>
            </div>
            <div className="mt-10 flex gap-8 text-sm text-cream-300/70">
              <div>
                <p className="font-serif text-2xl text-gold-300">500+</p>
                <p>Nhãn rượu tuyển chọn</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-gold-300">15+</p>
                <p>Quốc gia nhập khẩu</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-gold-300">10.000+</p>
                <p>Khách hàng tin tưởng</p>
              </div>
            </div>
          </div>
          <div className="relative hidden justify-center lg:flex">
            <div className="absolute h-80 w-80 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="flex gap-4">
              <WineBottleArt category="vang-do" className="h-96 w-auto drop-shadow-2xl" />
              <WineBottleArt category="vang-no" className="h-80 w-auto translate-y-10 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="container-lux py-16">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.2em] text-wine-700">DANH MỤC</p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Mua sắm theo dòng vang</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?category=${c.slug}`}
              className="group flex flex-col items-center rounded-2xl border border-ink-900/10 bg-cream-50 p-6 text-center transition-shadow hover:shadow-lg"
            >
              <WineBottleArt
                category={c.slug}
                className="h-32 w-auto transition-transform group-hover:-translate-y-1"
              />
              <h3 className="mt-4 font-serif text-lg text-ink-900">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-ink-700/60">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-cream-200/60 py-16">
        <div className="container-lux">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-wine-700">TUYỂN CHỌN</p>
              <h2 className="mt-2 font-serif text-3xl text-ink-900">Rượu vang nổi bật</h2>
            </div>
            <Link href="/san-pham" className="hidden text-sm font-semibold text-wine-700 hover:underline sm:block">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="container-lux py-16">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.2em] text-wine-700">XUẤT XỨ</p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Tuyển chọn từ khắp thế giới</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {countries.map((c) => (
            <Link
              key={c.slug}
              href={`/san-pham?country=${c.slug}`}
              className="flex items-center gap-2 rounded-full border border-ink-900/10 bg-cream-50 px-5 py-3 text-sm font-medium text-ink-800 transition-colors hover:border-wine-700 hover:text-wine-700"
            >
              <span className="text-lg">{c.flag}</span> {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Brand story */}
      <section className="bg-wine-950 py-16 text-cream-100">
        <div className="container-lux grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.2em] text-gold-300">CÂU CHUYỆN MDWINES</p>
            <h2 className="mt-2 font-serif text-3xl leading-snug">
              Hơn cả một chai vang — là trải nghiệm của sự tinh tế
            </h2>
            <p className="mt-5 leading-relaxed text-cream-300/85">
              Từ những vườn nho lâu đời tại Bordeaux đến các thung lũng nắng ấm Mendoza, đội ngũ
              chuyên gia của MDWines Cellar trực tiếp tuyển chọn từng nhãn rượu, đảm bảo hành
              trình vận chuyển và bảo quản đạt chuẩn quốc tế trước khi đến tay khách hàng.
            </p>
            <Link
              href="/gioi-thieu"
              className="mt-6 inline-block rounded-full border border-gold-400/60 px-6 py-3 text-sm font-semibold text-gold-300 hover:bg-gold-400/10"
            >
              Tìm hiểu thêm
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Nhập khẩu chính ngạch", "Đầy đủ chứng từ, tem nhãn phụ theo quy định."],
              ["Bảo quản chuẩn hầm rượu", "Kho lạnh kiểm soát nhiệt độ & độ ẩm 24/7."],
              ["Tư vấn chuyên sâu", "Đội ngũ Sommelier đồng hành chọn rượu phù hợp."],
              ["Giao hàng toàn quốc", "Đóng gói chống sốc, giao nhanh & an toàn."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl border border-white/10 p-5">
                <h3 className="font-serif text-gold-200">{title}</h3>
                <p className="mt-2 text-xs text-cream-300/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="container-lux py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.2em] text-wine-700">KIẾN THỨC</p>
            <h2 className="mt-2 font-serif text-3xl text-ink-900">Tin tức &amp; Cẩm nang rượu vang</h2>
          </div>
          <Link href="/tin-tuc" className="hidden text-sm font-semibold text-wine-700 hover:underline sm:block">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {news.map((post) => (
            <Link
              key={post.slug}
              href={`/tin-tuc/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className="h-40 w-full"
                style={{
                  background:
                    post.coverTone === "gold"
                      ? "linear-gradient(135deg,#dfbd6c,#8a692c)"
                      : post.coverTone === "emerald"
                      ? "linear-gradient(135deg,#4c5a33,#8a9a5b)"
                      : "linear-gradient(135deg,#74192f,#2a0a12)",
                }}
              />
              <div className="p-5">
                <p className="text-xs text-ink-700/60">{formatDate(post.publishedAt)}</p>
                <h3 className="mt-2 font-serif text-lg leading-snug text-ink-900 group-hover:text-wine-700">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-700/70">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
