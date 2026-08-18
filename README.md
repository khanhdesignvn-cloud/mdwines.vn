# MDWines Cellar

Website thương mại điện tử rượu vang cao cấp — phong cách sang trọng, lấy cảm hứng từ
[mdwines.com.vn](https://www.mdwines.com.vn) và [winecellar.vn](https://winecellar.vn) — kèm hệ
thống quản trị (quản lý sản phẩm & đơn hàng) tích hợp sẵn.

## Tính năng

**Trang khách hàng**
- Trang chủ giới thiệu thương hiệu, sản phẩm nổi bật, danh mục, xuất xứ, tin tức
- Danh sách sản phẩm với bộ lọc theo loại rượu / quốc gia / tìm kiếm / sắp xếp
- Trang chi tiết sản phẩm (hương vị, kết hợp món ăn, thông số kỹ thuật, đánh giá của khách, sản phẩm liên quan)
- Giỏ hàng (lưu trên trình duyệt) và thanh toán COD / chuyển khoản / **VNPay**, áp mã giảm giá, tạo đơn hàng thật
- Tài khoản khách hàng: đăng ký/đăng nhập, lưu thông tin giao hàng, xem lịch sử đơn hàng
- Đánh giá sản phẩm (khách đã đăng nhập) — điểm trung bình tự cập nhật
- Email xác nhận đơn hàng tự động (nếu đã cấu hình SMTP)
- Trang xác nhận đơn hàng, tra cứu đơn hàng, giới thiệu, tin tức/kiến thức, sự kiện, liên hệ

**Quản trị (`/admin`)**
- Đăng nhập bảo mật bằng session JWT (cookie httpOnly)
- Tổng quan: doanh thu, số đơn hàng, sản phẩm bán chạy, cảnh báo sắp hết hàng
- Quản lý sản phẩm: thêm / sửa / xóa, tồn kho, giá, khuyến mãi, trạng thái hiển thị, tải ảnh sản phẩm thật (tối đa 6 ảnh/sản phẩm)
- Quản lý đơn hàng: danh sách, lọc theo trạng thái, cập nhật trạng thái xử lý + trạng thái thanh toán (tự hoàn kho khi hủy đơn)
- Quản lý danh mục: tự thêm/sửa/xóa loại rượu và quốc gia xuất xứ, không cần lập trình viên
- Quản lý mã giảm giá: tạo mã % hoặc số tiền cố định, giới hạn lượt dùng/ngày hết hạn
- Kiểm duyệt đánh giá sản phẩm: xem và xóa đánh giá không phù hợp
- Hộp thư liên hệ: xem yêu cầu tư vấn từ khách, đánh dấu đã xử lý
- Xuất Excel: danh sách đơn hàng và sản phẩm

## Công nghệ

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + SQLite · Zod · jose (JWT) ·
nodemailer · ExcelJS · Tích hợp cổng thanh toán VNPay

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
- `Customer` — tài khoản khách hàng
- `Order`, `OrderItem` — đơn hàng và chi tiết đơn hàng (liên kết `Customer` nếu đã đăng nhập)
- `Coupon` — mã giảm giá
- `Review` — đánh giá sản phẩm (1 đánh giá/khách/sản phẩm)
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
- **Email xác nhận đơn hàng** cần khai báo `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` trong
  `.env` (xem `.env.example`). Nếu để trống, hệ thống chỉ ghi log cảnh báo và bỏ qua gửi mail —
  đặt hàng vẫn hoạt động bình thường.
- **Thanh toán VNPay** cần tài khoản merchant (miễn phí, đăng ký sandbox tại
  [sandbox.vnpayment.vn](https://sandbox.vnpayment.vn)) rồi điền `VNPAY_TMN_CODE` và
  `VNPAY_HASH_SECRET` vào `.env`. Chưa cấu hình thì khách chọn VNPay sẽ thấy thông báo lỗi rõ
  ràng thay vì bị crash. IPN callback (`/api/payment/vnpay/ipn`) cần server có domain/IP công
  khai để VNPay gọi tới — không hoạt động khi chạy `localhost`.
