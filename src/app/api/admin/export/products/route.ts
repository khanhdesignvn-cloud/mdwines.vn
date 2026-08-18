import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, country: true },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sản phẩm");

  sheet.columns = [
    { header: "SKU", key: "sku", width: 16 },
    { header: "Tên sản phẩm", key: "name", width: 32 },
    { header: "Loại rượu", key: "category", width: 16 },
    { header: "Xuất xứ", key: "country", width: 14 },
    { header: "Vùng trồng", key: "region", width: 18 },
    { header: "Niên vụ", key: "vintage", width: 10 },
    { header: "Giá bán", key: "price", width: 14 },
    { header: "Giá KM", key: "salePrice", width: 14 },
    { header: "Tồn kho", key: "stock", width: 10 },
    { header: "Đánh giá", key: "rating", width: 10 },
    { header: "Trạng thái", key: "status", width: 12 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const p of products) {
    sheet.addRow({
      sku: p.sku,
      name: p.name,
      category: p.category.name,
      country: p.country.name,
      region: p.region ?? "",
      vintage: p.vintage ?? "",
      price: p.price,
      salePrice: p.salePrice ?? "",
      stock: p.stock,
      rating: p.rating,
      status: p.status === "active" ? "Đang bán" : "Đã ẩn",
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `san-pham-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
