import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Tên sản phẩm quá ngắn").max(200),
  sku: z
    .string()
    .trim()
    .min(2, "SKU quá ngắn")
    .max(40)
    .regex(/^[A-Za-z0-9-]+$/, "SKU chỉ gồm chữ, số và dấu gạch ngang"),
  categoryId: z.string().min(1, "Vui lòng chọn loại rượu"),
  countryId: z.string().min(1, "Vui lòng chọn xuất xứ"),
  region: z.string().trim().max(120).optional().or(z.literal("")),
  vintage: z.number().int().min(1900).max(2100).nullable().optional(),
  grapeVariety: z.string().trim().max(200).optional().or(z.literal("")),
  alcoholPercent: z.number().min(0).max(80).nullable().optional(),
  volumeMl: z.number().int().min(1).max(20000).default(750),
  price: z.number().int().min(0, "Giá không hợp lệ"),
  salePrice: z.number().int().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  shortDescription: z.string().trim().max(400).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  tastingNotes: z.string().trim().max(2000).optional().or(z.literal("")),
  foodPairing: z.string().trim().max(1000).optional().or(z.literal("")),
  awards: z.string().trim().max(400).optional().or(z.literal("")),
  rating: z.number().min(0).max(5).default(4.5),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  status: z.enum(["active", "hidden"]).default("active"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
