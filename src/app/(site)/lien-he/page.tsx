import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ với MDWines Cellar để được tư vấn và đặt hàng rượu vang cao cấp.",
};

const infoCards = [
  ["Showroom trưng bày", ["88 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh", "Giờ mở cửa: 9:00 – 21:00 (T2 – CN)"]],
  ["Hotline & Email", ["Hotline tư vấn: 1900 6868", "Email: cellar@mdwines.vn"]],
  [
    "Đặt vang cho doanh nghiệp & sự kiện",
    ["Chúng tôi hỗ trợ tư vấn số lượng lớn cho tiệc cưới, sự kiện khai trương, quà tặng doanh nghiệp cuối năm."],
  ],
] as const;

export default function ContactPage() {
  return (
    <div className="container-lux py-10">
      <div className="animate-fade-up mb-10">
        <p className="text-xs tracking-[0.2em] text-wine-700">LIÊN HỆ</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">Kết nối với MDWines Cellar</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-700/70">
          Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn chọn lựa chai vang phù hợp
          nhất cho mọi dịp đặc biệt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {infoCards.map(([title, lines], i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6 transition-shadow duration-300 hover:shadow-lg">
                <h2 className="font-serif text-lg text-wine-800">{title}</h2>
                {lines.map((line) => (
                  <p key={line} className="mt-2 text-sm text-ink-700/75 first:mt-2">
                    {line}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  );
}
