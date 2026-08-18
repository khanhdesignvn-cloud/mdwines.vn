# MDWines Cellar

Website thương mại điện tử rượu vang cao cấp — phong cách sang trọng, lấy cảm hứng từ
[mdwines.com.vn](https://www.mdwines.com.vn) và [winecellar.vn](https://winecellar.vn) — kèm hệ
thống quản trị (quản lý sản phẩm & đơn hàng) tích hợp sẵn.

## Tính năng

**Trang khách hàng**
- Trang chủ giới thiệu thương hiệu, sản phẩm nổi bật, danh mục, xuất xứ, tin tức
- Danh sách sản phẩm với bộ lọc theo loại rượu / quốc gia / tìm kiếm / sắp xếp
- Trang chi tiết sản phẩm (hương vị, kết hợp món ăn, thông số kỹ thuật, sản phẩm liên quan)
- Giỏ hàng (lưu trên trình duyệt) và thanh toán (COD / chuyển khoản), tạo đơn hàng thật
- Trang xác nhận đơn hàng, giới thiệu, tin tức/kiến thức, sự kiện, liên hệ

**Quản trị (`/admin`)**
- Đăng nhập bảo mật bằng session JWT (cookie httpOnly)
- Tổng quan: doanh thu, số đơn hàng, sản phẩm bán chạy, cảnh báo sắp hết hàng
- Quản lý sản phẩm: thêm / sửa / xóa, tồn kho, giá, khuyến mãi, trạng thái hiển thị
- Quản lý đơn hàng: danh sách, lọc theo trạng thái, cập nhật trạng thái xử lý

## Công nghệ

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + SQLite · Zod · jose (JWT)

## Bắt đầu

```bash
npm install
cp .env.example .env   # chỉnh AUTH_SECRET cho môi trường thật
npx prisma migrate dev
npm run db:seed
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

Tài khoản quản trị demo (tạo bởi lệnh seed): `admin@mdwines.vn` / `MDWines@2026`

## Cấu trúc dữ liệu chính

- `Category`, `Country` — danh mục loại rượu và xuất xứ
- `Product` — sản phẩm rượu vang (giá, tồn kho, mô tả, hương vị, giải thưởng...)
- `Order`, `OrderItem` — đơn hàng và chi tiết đơn hàng
- `AdminUser` — tài khoản quản trị
- `NewsPost` — bài viết tin tức/kiến thức

## Ghi chú

- Cơ sở dữ liệu mặc định là SQLite (`prisma/dev.db`), phù hợp phát triển/demo. Khi triển khai
  production nên chuyển sang PostgreSQL/MySQL bằng cách đổi `provider` trong
  `prisma/schema.prisma` và `DATABASE_URL`.
- Hình ảnh chai rượu hiện dùng minh họa SVG theo từng loại rượu; có thể thay bằng ảnh sản phẩm
  thật bằng cách mở rộng trường `images` trên `Product`.
