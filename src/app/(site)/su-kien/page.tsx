import type { Metadata } from "next";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Sự kiện thưởng rượu",
  description: "Các sự kiện thưởng rượu vang, workshop và buổi giao lưu cùng chuyên gia của MDWines Cellar.",
};

const events = [
  {
    title: "Đêm thưởng vang Bordeaux cùng chuyên gia Sommelier",
    date: new Date("2026-09-12"),
    location: "Showroom MDWines Cellar, 88 Nguyễn Huệ, Q.1, TP.HCM",
    description:
      "Hành trình khám phá 6 chai vang tiêu biểu từ Bordeaux qua các niên vụ khác nhau, cùng phần chia sẻ kỹ thuật thưởng thức chuyên sâu từ Sommelier.",
    tone: "burgundy",
  },
  {
    title: "Workshop: Nghệ thuật kết hợp rượu vang và ẩm thực Việt",
    date: new Date("2026-10-03"),
    location: "Showroom MDWines Cellar, 88 Nguyễn Huệ, Q.1, TP.HCM",
    description:
      "Khám phá cách kết hợp các dòng vang quốc tế với hương vị đặc trưng của ẩm thực Việt Nam, từ món cuốn đến các món nướng đậm đà.",
    tone: "gold",
  },
  {
    title: "Tiệc ra mắt bộ sưu tập Champagne mùa lễ hội",
    date: new Date("2026-12-06"),
    location: "Khách sạn 5 sao, Quận 1, TP.HCM",
    description:
      "Sự kiện thường niên giới thiệu những chai Champagne và vang nổ cao cấp nhất cho mùa lễ hội cuối năm.",
    tone: "emerald",
  },
];

const TONE_GRADIENT: Record<string, string> = {
  gold: "linear-gradient(135deg,#dfbd6c,#8a692c)",
  emerald: "linear-gradient(135deg,#4c5a33,#8a9a5b)",
  burgundy: "linear-gradient(135deg,#74192f,#2a0a12)",
};

export default function EventsPage() {
  return (
    <div className="container-lux py-10">
      <div className="animate-fade-up mb-10">
        <p className="text-xs tracking-[0.2em] text-wine-700">SỰ KIỆN</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">Sự kiện thưởng rượu sắp diễn ra</h1>
        <p className="mt-2 max-w-xl text-sm text-ink-700/70">
          Tham gia cùng MDWines Cellar trong những buổi thưởng vang, workshop và sự kiện giao
          lưu dành riêng cho cộng đồng yêu rượu vang.
        </p>
      </div>

      <div className="space-y-6">
        {events.map((event, i) => (
          <Reveal key={event.title} delay={i * 100}>
            <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row">
              <div
                className="flex h-40 shrink-0 flex-col items-center justify-center text-cream-50 sm:h-auto sm:w-48"
                style={{ background: TONE_GRADIENT[event.tone] }}
              >
                <p className="text-3xl font-serif">{event.date.getDate()}</p>
                <p className="text-sm uppercase tracking-wide">
                  Tháng {event.date.getMonth() + 1}, {event.date.getFullYear()}
                </p>
              </div>
              <div className="flex-1 p-6">
                <h2 className="font-serif text-xl text-ink-900">{event.title}</h2>
                <p className="mt-1 text-xs text-ink-700/60">
                  {formatDate(event.date)} · {event.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-800/80">{event.description}</p>
                <a
                  href="/lien-he"
                  className="mt-4 inline-block text-sm font-semibold text-wine-700 hover:underline"
                >
                  Đăng ký tham dự →
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
