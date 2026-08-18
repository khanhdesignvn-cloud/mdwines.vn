import Link from "next/link";
import type { Metadata } from "next";
import { getNewsPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Tin tức & Kiến thức rượu vang",
  description: "Cẩm nang, kiến thức và câu chuyện về thế giới rượu vang từ MDWines Cellar.",
};

const TONE_GRADIENT: Record<string, string> = {
  gold: "linear-gradient(135deg,#dfbd6c,#8a692c)",
  emerald: "linear-gradient(135deg,#4c5a33,#8a9a5b)",
  burgundy: "linear-gradient(135deg,#74192f,#2a0a12)",
};

export default async function NewsListPage() {
  const posts = await getNewsPosts();

  return (
    <div className="container-lux py-10">
      <div className="animate-fade-up mb-10">
        <p className="text-xs tracking-[0.2em] text-wine-700">KIẾN THỨC</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900">Tin tức &amp; Cẩm nang rượu vang</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 90}>
            <Link
              href={`/tin-tuc/${post.slug}`}
              className="group block h-full overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="h-44 w-full transition-transform duration-500 group-hover:scale-105"
                style={{ background: TONE_GRADIENT[post.coverTone] ?? TONE_GRADIENT.burgundy }}
              />
              <div className="p-5">
                <p className="text-xs text-ink-700/60">
                  {formatDate(post.publishedAt)} · {post.author}
                </p>
                <h2 className="mt-2 font-serif text-lg leading-snug text-ink-900 group-hover:text-wine-700">
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-ink-700/70">{post.excerpt}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
