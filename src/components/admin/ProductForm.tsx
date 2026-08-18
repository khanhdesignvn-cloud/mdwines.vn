"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Country, Product } from "@prisma/client";
import { parseProductImages } from "@/lib/product-image";

type Props = {
  categories: Category[];
  countries: Country[];
  product?: Product;
};

export function ProductForm({ categories, countries, product }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(() => parseProductImages(product?.images));
  const [uploading, setUploading] = useState(false);
  const isEdit = Boolean(product);

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 6 - images.length)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Không thể tải ảnh lên");
          continue;
        }
        setImages((prev) => [...prev, json.url]);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const num = (key: string) => {
      const v = form.get(key);
      return v === null || v === "" ? undefined : Number(v);
    };

    const payload = {
      name: String(form.get("name") || ""),
      sku: String(form.get("sku") || ""),
      categoryId: String(form.get("categoryId") || ""),
      countryId: String(form.get("countryId") || ""),
      region: String(form.get("region") || ""),
      vintage: num("vintage") ?? null,
      grapeVariety: String(form.get("grapeVariety") || ""),
      alcoholPercent: num("alcoholPercent") ?? null,
      volumeMl: num("volumeMl") ?? 750,
      price: num("price") ?? 0,
      salePrice: num("salePrice") ?? null,
      stock: num("stock") ?? 0,
      shortDescription: String(form.get("shortDescription") || ""),
      description: String(form.get("description") || ""),
      tastingNotes: String(form.get("tastingNotes") || ""),
      foodPairing: String(form.get("foodPairing") || ""),
      awards: String(form.get("awards") || ""),
      rating: num("rating") ?? 4.5,
      featured: form.get("featured") === "on",
      isNew: form.get("isNew") === "on",
      status: form.get("status") === "hidden" ? "hidden" : "active",
      images,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Có lỗi xảy ra");
        setSubmitting(false);
        return;
      }
      router.push("/admin/san-pham");
      router.refresh();
    } catch {
      setError("Không thể kết nối máy chủ");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      router.push("/admin/san-pham");
      router.refresh();
    } else {
      setError(json.error ?? "Không thể xóa sản phẩm");
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-ink-900/15 bg-cream-50 px-3 py-2 text-sm focus:border-wine-700 focus:outline-none";
  const labelClass = "mb-1 block text-xs font-medium text-ink-700/70";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
        <h2 className="font-serif text-lg text-ink-900">Thông tin cơ bản</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Tên sản phẩm *</label>
            <input name="name" required defaultValue={product?.name} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SKU *</label>
            <input name="sku" required defaultValue={product?.sku} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Loại rượu *</label>
            <select name="categoryId" required defaultValue={product?.categoryId} className={inputClass}>
              <option value="">-- Chọn --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Xuất xứ *</label>
            <select name="countryId" required defaultValue={product?.countryId} className={inputClass}>
              <option value="">-- Chọn --</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Vùng trồng</label>
            <input name="region" defaultValue={product?.region ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Giống nho</label>
            <input name="grapeVariety" defaultValue={product?.grapeVariety ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Niên vụ</label>
            <input name="vintage" type="number" defaultValue={product?.vintage ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nồng độ cồn (%)</label>
            <input
              name="alcoholPercent"
              type="number"
              step="0.1"
              defaultValue={product?.alcoholPercent ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Dung tích (ml)</label>
            <input name="volumeMl" type="number" defaultValue={product?.volumeMl ?? 750} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
        <h2 className="font-serif text-lg text-ink-900">Hình ảnh sản phẩm</h2>
        <p className="mt-1 text-xs text-ink-700/60">
          Tối đa 6 ảnh (JPG, PNG, WEBP, AVIF — dưới 5MB). Ảnh đầu tiên là ảnh đại diện. Nếu
          không có ảnh, hệ thống sẽ hiển thị minh họa mặc định theo loại rượu.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((src, i) => (
            <div key={src} className="relative h-24 w-24 overflow-hidden rounded-lg border border-ink-900/10">
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] text-cream-50">
                  Đại diện
                </span>
              )}
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                aria-label="Xóa ảnh"
              >
                ✕
              </button>
            </div>
          ))}
          {images.length < 6 && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-ink-900/20 text-xs text-ink-700/60 hover:border-wine-700 hover:text-wine-700">
              {uploading ? "Đang tải..." : "+ Thêm ảnh"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  handleFileSelect(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
        <h2 className="font-serif text-lg text-ink-900">Giá &amp; Tồn kho</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Giá bán (₫) *</label>
            <input name="price" type="number" required defaultValue={product?.price} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Giá khuyến mãi (₫)</label>
            <input name="salePrice" type="number" defaultValue={product?.salePrice ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tồn kho *</label>
            <input name="stock" type="number" required defaultValue={product?.stock ?? 0} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Đánh giá (0-5)</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              defaultValue={product?.rating ?? 4.5}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Trạng thái</label>
            <select name="status" defaultValue={product?.status ?? "active"} className={inputClass}>
              <option value="active">Đang bán</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isNew" defaultChecked={product?.isNew} /> Sản phẩm mới
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-900/10 bg-cream-50 p-6">
        <h2 className="font-serif text-lg text-ink-900">Nội dung mô tả</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>Mô tả ngắn</label>
            <textarea name="shortDescription" rows={2} defaultValue={product?.shortDescription ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Mô tả chi tiết</label>
            <textarea name="description" rows={4} defaultValue={product?.description ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hương vị</label>
            <textarea name="tastingNotes" rows={2} defaultValue={product?.tastingNotes ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Gợi ý kết hợp món ăn</label>
            <textarea name="foodPairing" rows={2} defaultValue={product?.foodPairing ?? ""} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Giải thưởng</label>
            <input name="awards" defaultValue={product?.awards ?? ""} className={inputClass} />
          </div>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="rounded-full bg-wine-800 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-wine-700 disabled:opacity-60"
          >
            {submitting ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/san-pham")}
            className="rounded-full border border-ink-900/15 px-6 py-2.5 text-sm text-ink-800 hover:bg-cream-200"
          >
            Hủy
          </button>
        </div>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-red-300 px-5 py-2.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Đang xóa..." : "Xóa sản phẩm"}
          </button>
        )}
      </div>
    </form>
  );
}
