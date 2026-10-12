# 📱 Pocket Calculator (Máy tính cầm tay bỏ túi nâng cao)

Ứng dụng Máy tính cầm tay bỏ túi giả lập giao diện Neumorphism sang trọng, trực quan, hỗ trợ đầy đủ các phép tính số học, lưu trữ lịch sử, phím tắt bàn phím vật lý, khả năng responsive mượt mà và kiểm thử tự động với Playwright.

## 🌟 Tính năng chính

- **[SC-01] Phép tính cơ bản:** Cộng, trừ, nhân, chia với cơ chế xử lý độ chính xác số thập phân (tránh lỗi floating-point `0.1 + 0.2`).
- **[SC-02] Xử lý ngoại lệ cực hạn:** Chống lỗi chia cho 0 (`Error: Division by zero`), chống nhập nhiều dấu chấm thập phân liên tiếp, tự động thu nhỏ cỡ chữ khi màn hình hiển thị chuỗi số dài để tránh tràn màn hình (Overflow).
- **[SC-03] Tính năng nâng cao & Lịch sử:**
  - Tính năng xóa lùi (DEL/Backspace), xóa sạch (AC/Escape), đảo dấu (+/-), và tính nhanh phần trăm (%).
  - Lịch sử 10 phép tính gần nhất lưu trực tiếp vào `localStorage`. Cho phép tái sử dụng biểu thức cũ bằng cách click vào lịch sử.
- **[SC-04] Responsive & Hỗ trợ Bàn phím:** Giao diện tối ưu hóa cho Mobile, Tablet và Desktop. Hỗ trợ toàn bộ phím tắt bàn phím số, phím toán tử, `Enter` để bằng `=`, `Backspace` để xóa số, và `Escape` để Reset.

---

## 🛠️ Hướng dẫn cài đặt và khởi chạy

### Bước 1: Cài đặt các thư viện cần thiết
Đảm bảo bạn đã cài đặt Node.js. Chạy lệnh sau để cài đặt các dependency (bao gồm Express làm web server và Playwright để chạy test):
```bash
npm install
```

### Bước 2: Khởi chạy ứng dụng
Chạy lệnh khởi động web server:
```bash
npm start
```
Truy cập ứng dụng ngay tại địa chỉ: [http://localhost:3000](http://localhost:3000)

### Bước 3: Chạy kiểm thử tự động (E2E Test)
Chạy bộ kiểm thử tự động bằng Playwright để kiểm tra các kịch bản nghiệp vụ:
```bash
npm test
```

---

## 📂 Cấu trúc thư mục dự án
```text
pocket-calculator/
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── calculator.test.js
```
```

---