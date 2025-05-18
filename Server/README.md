# Server

Thư mục chứa toàn bộ mã nguồn ứng dụng

# Hướng dẫn khởi tạo dự án Backend (Server)

## 1. Yêu cầu môi trường
- Node.js >= 16.x
- npm >= 8.x
- (Tùy chọn) PostgreSQL/MySQL/MongoDB nếu kết nối database

## 2. Cài đặt dependencies
Chạy các lệnh sau trong thư mục `Server/`:

```bash
npm install
```

## 3. Cấu hình biến môi trường
- Sao chép file `.env.example` thành `.env`:
  
  ```bash
  copy .env.example .env  # Windows
  # hoặc
  cp .env.example .env    # macOS/Linux
  ```
- Chỉnh sửa các giá trị trong file `.env` cho phù hợp với môi trường của bạn (PORT, DB_URL, SECRET_KEY, ...).

## 4. Khởi chạy server
- Chạy lệnh sau trong thư mục `Server/`:

```bash
node server.js
```

- Nếu muốn tự động reload khi thay đổi code, cài đặt nodemon:

```bash
npm install --save-dev nodemon
```

- Sau đó chạy:

```bash
npx nodemon server.js
```

## 5. Cấu trúc thư mục
- `src/api/`         : Định nghĩa các route (API endpoints)
- `src/controllers/` : Xử lý logic request/response, gọi services
- `src/services/`    : Business logic chính của ứng dụng
- `src/db/`          : Tương tác database 
- `src/middleware/`  : Các middleware tái sử dụng
- `src/config/`      : Cấu hình ứng dụng
- `src/utils/`       : Hàm tiện ích dùng chung
- `tests/`           : Chứa các file test

## 6. Một số lệnh hữu ích
- Cài thêm package: `npm install <package-name>`
- Kiểm tra phiên bản Node.js: `node -v`
- Kiểm tra phiên bản npm: `npm -v`

## 7. Lưu ý
- Không commit file `.env` lên git.
- Đọc kỹ comment trong từng file cấu hình để biết cách chỉnh sửa.

---
Mọi thắc mắc vui lòng liên hệ trưởng nhóm hoặc người quản lý dự án.