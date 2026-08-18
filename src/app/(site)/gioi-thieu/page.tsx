import type { Metadata } from "next";
import Link from "next/link";
import { WineBottleArt } from "@/components/product/WineBottleArt";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Câu chuyện thương hiệu MDWines Cellar - nhà nhập khẩu rượu vang cao cấp tại Việt Nam.",
};

const milestones = [
  ["2012", "Thành lập MDWines, khởi đầu với showroom đầu tiên tại TP. Hồ Chí Minh."],
  ["2016", "Trở thành nhà phân phối chính thức của hơn 30 thương hiệu vang quốc tế."],
  ["2019", "Khai trương hầm rượu tiêu chuẩn quốc tế, sức chứa hơn 50.000 chai."],
  ["2023", "Ra mắt nền tảng thương mại điện tử, phục vụ khách hàng trên toàn quốc."],
  ["2026", "Hơn 10.000 khách hàng thân thiết, 500+ nhãn rượu tuyển chọn."],
];

const values = [
  ["Chính hãng & Minh bạch", "100% sản phẩm nhập khẩu chính ngạch, đầy đủ chứng từ, tem nhãn phụ."],
  ["Tận tâm tư vấn", "Đội ngũ chuyên gia đồng hành giúp khách hàng chọn đúng chai vang cho từng dịp."],
  ["Chuẩn mực bảo quản", "Kho lạnh kiểm soát nhiệt độ, độ ẩm nghiêm ngặt theo tiêu chuẩn quốc tế."],
  ["Dịch vụ trọn vẹn", "Từ tư vấn, giao hàng đến hậu mãi — mọi trải nghiệm đều được chăm chút."],
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-ink-900 py-20 text-cream-100">
        <div className="bg-pattern-vine pointer-events-none absolute inset-0 opacity-20" />
        <div className="container-lux relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="animate-fade-up">
            <p className="text-xs tracking-[0.2em] text-gold-300">VỀ CHÚNG TÔI</p>
            <h1 className="mt-2 font-serif text-4xl leading-tight">
              MDWines Cellar — Đồng hành cùng đam mê rượu vang
            </h1>
            <p className="mt-5 leading-relaxed text-cream-300/85">
              Hơn một thập kỷ hình thành và phát triển, MDWines Cellar tự hào là điểm đến tin
              cậy của những người yêu rượu vang tại Việt Nam. Chúng tôi trực tiếp làm việc với
              các nhà sản xuất và vườn nho danh tiếng trên khắp thế giới để mang đến những chai
              vang chất lượng nhất, cùng trải nghiệm dịch vụ đẳng cấp.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <WineBottleArt category="vang-do" className="animate-float h-72 w-auto" />
            <WineBottleArt category="vang-trang" className="animate-float-slow h-64 w-auto translate-y-8" />
          </div>
        </div>
      </section>

      <section className="container-lux py-16">
        <Reveal className="mb-10 text-center">
          <p className="text-xs tracking-[0.2em] text-wine-700">GIÁ TRỊ CỐT LÕI</p>
          <h2 className="mt-2 font-serif text-3xl text-ink-900">Điều làm nên MDWines</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(([title, desc], i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="h-full rounded-2xl border border-ink-900/10 bg-cream-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-serif text-lg text-wine-800">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700/75">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream-200/60 py-16">
        <div className="container-lux">
          <Reveal className="mb-10 text-center">
            <p className="text-xs tracking-[0.2em] text-wine-700">HÀNH TRÌNH</p>
            <h2 className="mt-2 font-serif text-3xl text-ink-900">Dấu ấn phát triển</h2>
          </Reveal>
          <div className="mx-auto max-w-2xl space-y-6 border-l-2 border-gold-400/50 pl-8">
            {milestones.map(([year, desc], i) => (
              <Reveal key={year} delay={i * 110} className="relative">
                <span className="absolute -left-[38px] flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 shadow-[0_0_0_4px_rgba(201,162,75,0.18)]" />
                <p className="font-serif text-lg text-wine-800">{year}</p>
                <p className="text-sm text-ink-700/75">{desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Reveal className="container-lux py-16 text-center">
        <h2 className="font-serif text-3xl text-ink-900">Sẵn sàng khám phá bộ sưu tập?</h2>
        <p className="mt-3 text-ink-700/70">Hơn 500 nhãn rượu vang đang chờ đợi bạn.</p>
        <Link
          href="/san-pham"
          className="mt-6 inline-block rounded-full bg-wine-800 px-8 py-3 text-sm font-semibold text-cream-50 transition-transform duration-300 hover:scale-105 hover:bg-wine-700 active:scale-95"
        >
          Khám phá ngay
        </Link>
      </Reveal>
    </div>
  );
}
