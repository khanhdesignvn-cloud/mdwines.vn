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
- Quản lý sản phẩm: thêm / sửa / xóa, tồn kho, giá, khuyến mãi, trạng thái hiển thị, tải ảnh sản phẩm thật (tối đa 6 ảnh/sản phẩm)
- Quản lý đơn hàng: danh sách, lọc theo trạng thái, cập nhật trạng thái xử lý (tự hoàn kho khi hủy đơn)
- Quản lý danh mục: tự thêm/sửa/xóa loại rượu và quốc gia xuất xứ, không cần lập trình viên
- Hộp thư liên hệ: xem yêu cầu tư vấn từ khách, đánh dấu đã xử lý

**Tiện ích khách hàng**
- Tra cứu đơn hàng bằng mã đơn + số điện thoại (`/tra-cuu-don-hang`), không cần tài khoản

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

- `Category`, `Country` — danh mục loại rượu và xuất xứ (quản lý được trong admin)
- `Product` — sản phẩm rượu vang (giá, tồn kho, mô tả, hương vị, giải thưởng, ảnh...)
- `Order`, `OrderItem` — đơn hàng và chi tiết đơn hàng
- `AdminUser` — tài khoản quản trị
- `NewsPost` — bài viết tin tức/kiến thức
- `ContactMessage` — yêu cầu liên hệ từ khách hàng

## Ghi chú

- Cơ sở dữ liệu mặc định là SQLite (`prisma/dev.db`), phù hợp phát triển/demo. Khi triển khai
  production nên chuyển sang PostgreSQL/MySQL bằng cách đổi `provider` trong
  `prisma/schema.prisma` và `DATABASE_URL`.
- Ảnh sản phẩm tải lên qua trang quản trị được lưu tại thư mục `uploads/products/` ở gốc dự án
  (không nằm trong `public/`) và phục vụ qua route động `/api/uploads/products/[filename]` —
  cách này cho phép ảnh mới tải lên hiển thị ngay lập tức mà không cần khởi động lại server.
  Nếu sản phẩm chưa có ảnh, hệ thống sẽ hiển thị minh họa SVG theo từng loại rượu.
  Khi triển khai production trên hạ tầng serverless (Vercel, ...), thư mục này không bền vững
  giữa các lần triển khai — nên thay bằng lưu trữ đối tượng ngoài (S3, Cloudinary, R2...).
