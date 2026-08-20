# Triển khai lên VPS Tino qua cPanel

Hướng dẫn này dùng công cụ **Setup Node.js App** (Phusion Passenger) và **Terminal** có sẵn
trong cPanel — không cần cài Nginx/PM2 thủ công, cPanel tự quản lý tiến trình và proxy domain
vào ứng dụng.

## 1. Tạo ứng dụng Node.js trong cPanel

cPanel → mục **Software** → **Setup Node.js App** → **Create Application**:

- **Node.js version**: chọn phiên bản cao nhất có (>= 20.x)
- **Application mode**: `Production`
- **Application root**: `mdwines` (sẽ tạo thư mục `~/mdwines`)
- **Application URL**: chọn domain hoặc subdomain sẽ chạy web (ví dụ `mdwines.vn`)
- **Application startup file**: `server.js`

Bấm **Create**. cPanel sẽ tạo sẵn thư mục `~/mdwines` với vài file mẫu — sẽ thay thế ở bước sau.

Sau khi tạo xong, ở đầu trang chi tiết ứng dụng, cPanel hiển thị dòng lệnh **"Enter to the
virtual environment"** dạng:

```bash
source /home/<user>/nodevenv/mdwines/20/bin/activate && cd /home/<user>/mdwines
```

Giữ lại dòng này — sẽ dùng ở bước 3.

## 2. Đưa mã nguồn lên qua Terminal

Mở **Terminal** trong cPanel:

```bash
cd ~/mdwines
rm -rf ..?* .[!.]* *            # xoá sạch file mẫu cPanel tạo sẵn (Application URL ở bước 1 không bị mất)
git clone -b claude/wine-website-design-t4obvf \
  https://github.com/khanhdesignvn-cloud/mdwines.vn.git .
```

## 3. Cài đặt, cấu hình, khởi tạo dữ liệu

Kích hoạt virtual environment (dùng đúng dòng lệnh cPanel đưa cho bạn ở bước 1):

```bash
source /home/<user>/nodevenv/mdwines/20/bin/activate && cd /home/<user>/mdwines
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed      # BỎ QUA nếu đã có dữ liệu thật, seed sẽ XÓA dữ liệu cũ
npm run build
```

## 4. Khai báo biến môi trường

Quay lại trang **Setup Node.js App** trong cPanel → mở ứng dụng `mdwines` → mục **Environment
variables** → thêm từng biến (không cần tạo file `.env` thủ công, cPanel sẽ tự truyền vào tiến
trình):

| Biến | Giá trị |
|---|---|
| `DATABASE_URL` | `file:./dev.db` |
| `AUTH_SECRET` | chuỗi ngẫu nhiên mạnh — tạo bằng `openssl rand -base64 32` trong Terminal |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | (tuỳ chọn) để gửi email xác nhận đơn hàng |
| `ADMIN_NOTIFY_EMAIL` | (tuỳ chọn) email nhận thông báo đơn hàng mới |
| `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` | thông tin merchant VNPay |
| `VNPAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` (sandbox) hoặc URL production khi có tài khoản thật |

Bấm **Save**, rồi bấm **Restart** ở đầu trang để áp dụng.

## 5. Bật SSL

cPanel thường tự cấp SSL miễn phí (AutoSSL) cho domain đã trỏ đúng DNS. Kiểm tra ở
**SSL/TLS Status** — nếu domain chưa có chứng chỉ, chọn domain và bấm **Run AutoSSL**.

## 6. Kiểm tra

Truy cập domain đã chọn ở bước 1. Đăng nhập `/admin` bằng tài khoản seed:
`admin@mdwines.vn` / `MDWines@2026` — **đổi mật khẩu này ngay** sau khi kiểm tra xong.

## Cập nhật lên phiên bản mới sau này

```bash
source /home/<user>/nodevenv/mdwines/20/bin/activate && cd /home/<user>/mdwines
git pull origin claude/wine-website-design-t4obvf
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Sau đó vào **Setup Node.js App** → bấm **Restart**.

## Lưu ý

- Ảnh sản phẩm tải lên qua `/admin` lưu ở `uploads/products/` trong thư mục ứng dụng — **backup
  định kỳ** thư mục này cùng file database (`prisma/dev.db`).
- Vì môi trường làm việc hiện tại của tôi chỉ gọi được HTTPS ra ngoài (không SSH/kết nối trực
  tiếp vào VPS), toàn bộ các bước trên cần bạn tự chạy trên cPanel/Terminal. Gặp lỗi ở bước nào,
  dán nguyên văn thông báo lỗi vào đây, tôi sẽ hướng dẫn tiếp.
