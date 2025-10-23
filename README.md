# Scoby Backend API

Backend API cho website Scoby - sản phẩm túi thân thiện môi trường.

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy server:
```bash
npm start
```

Hoặc chạy ở chế độ development:
```bash
npm run dev
```

## API Endpoints

### GET /
- Mô tả: Thông tin cơ bản về API
- Response: Thông tin API và danh sách endpoints

### GET /api/team
- Mô tả: Lấy danh sách thành viên nhóm
- Response: Danh sách 5 thành viên nhóm

### GET /api/products
- Mô tả: Lấy danh sách sản phẩm
- Response: Danh sách các loại túi scoby

### GET /api/plans
- Mô tả: Lấy danh sách dự định tương lai
- Query params:
  - `type`: "short-term" hoặc "long-term" (optional)
- Response: Danh sách kế hoạch phát triển

### POST /api/contact
- Mô tả: Gửi thông tin liên hệ
- Body:
  - `name`: Tên người gửi
  - `email`: Email
  - `message`: Nội dung tin nhắn
- Response: Xác nhận đã nhận tin nhắn

### GET /api/health
- Mô tả: Kiểm tra trạng thái server
- Response: Thông tin trạng thái server

## Cấu trúc dự án

```
back-end/
├── server.js          # File chính của server
├── package.json       # Dependencies và scripts
└── README.md         # Tài liệu hướng dẫn
```

## Công nghệ sử dụng

- Node.js
- Express.js
- CORS
- dotenv