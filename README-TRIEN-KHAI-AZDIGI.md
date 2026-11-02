# MD Wines VN — gói static cho AZDIGI

## Cách cài đặt

1. Trong cPanel AZDIGI, mở **File Manager** và truy cập thư mục gốc của tên miền (thường là `public_html`).
2. Sao lưu hoặc đổi tên `index.html` cũ nếu có.
3. Upload toàn bộ nội dung của gói này vào thư mục gốc tên miền, bao gồm `index.html`, thư mục `assets` và tệp `.htaccess`.
4. Giải nén trực tiếp trên hosting nếu bạn upload file ZIP; bảo đảm các tệp nằm trực tiếp trong `public_html`, không nằm trong một thư mục con.
5. Mở tên miền trong cửa sổ ẩn danh để kiểm tra trang chủ, một trang sản phẩm và một bài Journal.

## Phạm vi của gói static

Gói đã có sẵn HTML/CSS/JavaScript và toàn bộ hình ảnh Manus Storage cần thiết. Điều hướng đa trang, catalogue, Journal, mục lục, lightbox, cổng 18+ và giỏ cục bộ hoạt động trên shared hosting Apache.

> Luồng **gửi yêu cầu đặt hàng** của website gốc cần API tRPC và cơ sở dữ liệu. Gói static không bao gồm backend, database, OAuth hoặc biến môi trường; do đó không nên xem thao tác gửi đơn là đã vận hành trên AZDIGI chỉ với gói này. Để giữ chức năng đơn hàng, cần triển khai bản Node.js/full-stack và cấu hình database, hoặc tiếp tục dùng hosting Manus cho backend.

## Kiểm tra sau khi upload

- Nếu mở một URL như `/the-cellar-journal/kham-pha-barossa-tu-ban-tiec` bị 404, xác nhận đã upload tệp `.htaccess` và Apache cho phép rewrite.
- Nếu ảnh không hiển thị, xác nhận thư mục `assets/media` đã được giải nén hoàn chỉnh.
- Không upload tệp `.env` hoặc khóa bí mật lên shared hosting.
