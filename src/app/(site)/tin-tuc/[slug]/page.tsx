import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";

const TONE_GRADIENT: Record<string, string> = {
  gold: "linear-gradient(135deg,#dfbd6c,#8a692c)",
  emerald: "linear-gradient(135deg,#4c5a33,#8a9a5b)",
  burgundy: "linear-gradient(135deg,#74192f,#2a0a12)",
};

export async function generateMetadata({
  params,
}: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function NewsDetailPage({ params }: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  const post = await getNewsPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="container-lux max-w-3xl py-10">
      <nav className="mb-6 text-xs text-ink-700/60">
        <Link href="/tin-tuc" className="hover:text-wine-700">Tin tức</Link> / <span className="text-ink-800">{post.title}</span>
      </nav>

      <div
        className="h-56 w-full rounded-2xl sm:h-72"
        style={{ background: TONE_GRADIENT[post.coverTone] ?? TONE_GRADIENT.burgundy }}
      />

      <p className="mt-6 text-xs text-ink-700/60">
        {formatDate(post.publishedAt)} · {post.author}
      </p>
      <h1 className="mt-2 font-serif text-3xl leading-snug text-ink-900">{post.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-800/80">{post.excerpt}</p>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-ink-800/90">
        {post.content}
      </div>

      <div className="mt-12">
        <Link href="/tin-tuc" className="text-sm font-semibold text-wine-700 hover:underline">
          ← Xem thêm bài viết khác
        </Link>
      </div>
    </article>
  );
}
