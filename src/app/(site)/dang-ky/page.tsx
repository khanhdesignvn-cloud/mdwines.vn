"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          password: String(form.get("password") || ""),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Đăng ký thất bại");
        setSubmitting(false);
        return;
      }
      router.push("/tai-khoan");
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ");
      setSubmitting(false);
    }
  }

  return (
    <div className="container-lux flex justify-center py-16">
      <div className="w-full max-w-md rounded-2xl border border-ink-900/10 bg-cream-50 p-8">
        <h1 className="font-serif text-2xl text-ink-900">Tạo tài khoản</h1>
        <p className="mt-1 text-sm text-ink-700/60">
          Đăng ký để theo dõi đơn hàng và lưu thông tin giao hàng.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-ink-700/80">Họ và tên *</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700/80">Email *</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700/80">Số điện thoại</label>
            <input
              name="phone"
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-ink-700/80">Mật khẩu * (tối thiểu 6 ký tự)</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-lg border border-ink-900/15 bg-cream-50 px-4 py-2.5 focus:border-wine-700 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-wine-800 py-3 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
          >
            {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-700/70">
          Đã có tài khoản?{" "}
          <Link href="/dang-nhap" className="font-semibold text-wine-700 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
