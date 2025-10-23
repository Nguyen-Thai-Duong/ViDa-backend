# Hướng dẫn Setup SQL Server cho ViDa Website

## 🗄️ Bước 1: Tạo Database trong SQL Server Management Studio

### 1. Mở SQL Server Management Studio
- Kết nối đến SQL Server instance của bạn
- Thường là `localhost` hoặc `.\SQLEXPRESS`

### 2. Tạo Database mới
```sql
CREATE DATABASE ViDaQR;
GO

USE ViDaQR;
GO
```

### 3. Tạo bảng Products
```sql
CREATE TABLE Products (
    id NVARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    type NVARCHAR(100) NOT NULL,
    productionDate DATE NOT NULL,
    batchNumber NVARCHAR(100) NOT NULL,
    producer NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETDATE()
);
GO
```

## ⚙️ Bước 2: Cấu hình kết nối

### 1. Mở file `database.js`
### 2. Cập nhật thông tin kết nối:
```javascript
const config = {
    user: 'sa', // Username của bạn
    password: 'YourPassword123!', // Password của bạn
    server: 'localhost', // Server name
    database: 'ViDaQR', // Database name
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
```

### 3. Thay đổi các thông tin:
- `user`: Tên user SQL Server
- `password`: Mật khẩu SQL Server
- `server`: Tên server (localhost, .\SQLEXPRESS, etc.)

## 🚀 Bước 3: Chạy ứng dụng

### 1. Khởi động backend:
```bash
cd back-end
npm start
```

### 2. Kiểm tra kết nối:
- Nếu thành công: `✅ Connected to SQL Server database`
- Nếu lỗi: Kiểm tra lại thông tin kết nối

## 🔧 Troubleshooting

### Lỗi kết nối:
1. **Kiểm tra SQL Server đang chạy**
2. **Kiểm tra username/password**
3. **Kiểm tra tên server**
4. **Kiểm tra port (mặc định 1433)**

### Lỗi bảng không tồn tại:
1. Chạy script tạo bảng ở bước 1
2. Kiểm tra database name đúng chưa

### Lỗi quyền truy cập:
1. Đảm bảo user có quyền CREATE, INSERT, SELECT
2. Hoặc dùng user `sa` (administrator)

## 📊 Kiểm tra dữ liệu

### Xem tất cả sản phẩm:
```sql
SELECT * FROM Products ORDER BY createdAt DESC;
```

### Xem sản phẩm theo ID:
```sql
SELECT * FROM Products WHERE id = 'ViDa-1234567890-123';
```

## 🎯 Tính năng đã tích hợp

- ✅ **Tạo sản phẩm mới** → Lưu vào database
- ✅ **Tra cứu sản phẩm** → Đọc từ database  
- ✅ **Danh sách sản phẩm** → Hiển thị từ database
- ✅ **Auto backup** → SQL Server tự động backup
- ✅ **Lịch sử tạo** → Lưu timestamp

## 🔒 Bảo mật

- ✅ **Mật khẩu admin** → Bảo vệ trang tạo QR
- ✅ **SQL Injection protection** → Sử dụng parameterized queries
- ✅ **Connection pooling** → Tối ưu hiệu suất

## 📱 Sử dụng

1. **Tạo QR**: Truy cập `/qr-admin` → Đăng nhập → Tạo sản phẩm
2. **Tra cứu**: Truy cập `/qr-lookup` → Nhập mã sản phẩm
3. **Quản lý**: Xem danh sách sản phẩm đã tạo trong admin panel
