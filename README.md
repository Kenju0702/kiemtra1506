# NestJS User Management API

## Setup

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy ứng dụng

```bash
npm run start
```

## API Hướng dẫn sử dụng


---

### I. Đăng nhập

**POST** `/api/auth/login`

```json
{
  "username": "admin2",
  "password": "huhu"
}
```

---

### II. Đăng ký

**POST** `/api/auth/register`

```json
{
  "name": "Admin3",
  "username": "admin3",
  "email": "admin4@example.com",
  "password": "admin123",
  "phone": "0888888899",
  "avatar": "https://example.com/avatar.jpg"
}
```

---

### 1. Lấy tất cả người dùng

**GET** `/api/users/`

---

### 2. Tìm kiếm người dùng

**GET** `/api/users/search?username=admin2`

Tham số: `email`, `username`, `phone`, v.v.

---

### 3. Tạo người dùng

**POST** `/api/users`

```json
{
  "name": "Admin1",
  "username": "admin1",
  "email": "admin2@example.com",
  "password": "admin123",
  "phone": "0888888889",
  "avatar": "https://example.com/avatar.jpg",
  "status": "active",
  "role": "admin"
}
```

---

### 4. Lấy người dùng theo ID

**GET** `/api/users/{id}`

---

### 5. Cập nhật người dùng

**PATCH** `/api/users/{id}`

```json
{
  "name": "kevin tien",
  "email": "updated@example.com",
  "password":"hihihi",
  "isDeleted": true
}
```

---

### 6. Xóa mềm người dùng

**PATCH** `/api/users/{id}/delete`

---

### 7. Test quyền truy cập Student

**GET** `/api/student/StudentOnlyUse`

> **Lưu ý:** Tất cả các API yêu cầu token, vui lòng đăng nhập để lấy token trước và để ý file môi trường cổng 5000
