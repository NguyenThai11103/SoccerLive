# SoccerLive Backend

Backend monolithic cho nền tảng streaming bóng đá trực tiếp SoccerLive.

## 🛠️ Tech Stack

- **Framework**: Express.js
- **Database**: MySQL + Sequelize ORM
- **Cache**: Redis
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Validation**: express-validator
- **File Upload**: Multer

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/           # Database & Redis configuration
│   ├── controllers/      # Request handlers
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth, validation, upload
│   └── services/        # Business logic
├── seeders/             # Database seeders
├── public/              # Static files
├── uploads/             # File uploads
├── .env.example         # Environment template
├── package.json         # Dependencies
└── index.js            # Entry point
```

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

```bash
# Copy file .env.example
cp .env.example .env

# Chỉnh sửa file .env với thông tin của bạn
```

### 3. Tạo database

```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE soccerlive;
exit;
```

### 4. Chạy server

```bash
# Development mode
npm start

# Hoặc
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register    - Đăng ký tài khoản
POST   /api/auth/login       - Đăng nhập
GET    /api/auth/me          - Lấy thông tin user hiện tại (Protected)
```

### Matches

```
GET    /api/matches          - Lấy danh sách trận đấu
GET    /api/matches/live     - Lấy trận đấu đang live
GET    /api/matches/:id      - Lấy chi tiết trận đấu
POST   /api/matches          - Tạo trận đấu (Admin)
PATCH  /api/matches/:id/status - Cập nhật trạng thái (Admin)
PATCH  /api/matches/:id/score  - Cập nhật tỷ số (Admin)
```

## 🔐 Authentication

API sử dụng JWT Bearer token:

```bash
Authorization: Bearer <your_token>
```

## 🗄️ Database Models

### User

- id, username, email, password, fullName, avatar, role, isActive, lastLogin

### Match

- id, homeTeam, awayTeam, homeScore, awayScore, status, startTime, endTime, streamKey, streamUrl, thumbnail, league, venue, viewerCount

### MatchEvent

- id, matchId, type, team, player, minute, description, data

### ChatMessage

- id, matchId, userId, message, isDeleted

### ViewerStat

- id, matchId, userId, sessionId, joinTime, leaveTime, duration, ipAddress, userAgent

## 🔌 Socket.IO Events

### Client → Server

```javascript
socket.emit("join-match", matchId);
socket.emit("leave-match", matchId);
```

### Server → Client

```javascript
socket.on("match-status-updated", { matchId, status });
socket.on("score-updated", { matchId, homeScore, awayScore });
```

## 🌱 Database Seeding

```bash
# Chạy tất cả seeders
npm run db:seed

# Chạy một seeder cụ thể
npm run db:seed:one -- --seed seeder-name.js

# Undo tất cả seeders
npm run db:seed:undo
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 📝 Environment Variables

Xem file `.env.example` để biết tất cả các biến môi trường cần thiết.

## 🔧 Scripts

```bash
npm start              # Chạy server với nodemon
npm run dev            # Chạy server (alias)
npm run make:controller # Tạo controller mới
npm run make:route     # Tạo route mới
npm run make:seeder    # Tạo seeder mới
npm run db:seed        # Chạy seeders
```

## 📄 License

MIT
