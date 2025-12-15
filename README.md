# SoccerLive - Live Football Streaming Platform

![SoccerLive](https://img.shields.io/badge/Status-MVP-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📖 Tổng quan

SoccerLive là nền tảng streaming bóng đá trực tiếp với kiến trúc microservices, hỗ trợ:

- ⚽ Livestream trận đấu
- 💬 Chat realtime
- 📊 Cập nhật tỷ số & sự kiện trực tiếp
- 🔔 Thông báo realtime
- 📈 Analytics người xem

## 🏗️ Kiến trúc

### Microservices

- **Auth Service** (Port 3000) - Xác thực & phân quyền
- **Match Service** (Port 3001) - Quản lý trận đấu
- **Stream Service** (Port 3002) - Quản lý streaming
- **Chat Service** (Port 3003) - Chat realtime
- **Stats Service** (Port 3004) - Thống kê trực tiếp
- **Notification Service** (Port 3005) - Thông báo
- **Analytics Service** (Port 3006) - Phân tích dữ liệu

### Tech Stack

- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: React + Vite + TailwindCSS
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Message Broker**: RabbitMQ
- **API Gateway**: Nginx
- **Streaming**: Nginx RTMP + HLS
- **Container**: Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- OBS Studio (for streaming)

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd SoccerLive

# 2. Copy environment variables
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Access application
# Frontend: http://localhost:5173
# API: http://localhost/api
# RabbitMQ Management: http://localhost:15672
```

## 📁 Project Structure

```
SoccerLive/
├── services/           # Backend microservices
│   ├── auth-service/
│   ├── match-service/
│   ├── stream-service/
│   ├── chat-service/
│   ├── stats-service/
│   ├── notification-service/
│   └── analytics-service/
├── client/            # React frontend
├── nginx/             # API Gateway & RTMP
└── docker-compose.yml
```

## 🎬 Streaming Setup (OBS)

1. Mở OBS Studio
2. Settings → Stream
3. Service: **Custom**
4. Server: `rtmp://localhost:1935/live`
5. Stream Key: `match_<streamKey>` (lấy từ Match Service)
6. Start Streaming

## 📡 API Documentation

### Authentication

```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/users/me
```

### Matches

```bash
GET  /api/matches
GET  /api/matches/live
POST /api/matches (Admin)
PATCH /api/matches/:id/status (Admin)
```

### Streaming

```bash
GET /api/streams/:matchId/hls
GET /api/streams/:matchId/status
```

## 🔐 Default Credentials

### Admin Account (Create manually)

- Email: admin@soccerlive.com
- Password: admin123
- Role: ADMIN

### RabbitMQ Management

- URL: http://localhost:15672
- Username: soccerlive
- Password: soccerlive123

## 🧪 Testing

```bash
# Health check
curl http://localhost/health

# Register user
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","username":"testuser"}'

# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

## 📊 Database Schema

### Users

- id, email, username, password, role, avatar

### Matches

- id, homeTeam, awayTeam, homeScore, awayScore, status, startTime, streamKey

### MatchEvents

- id, matchId, type, team, player, minute, data

### ViewerStats

- id, matchId, userId, joinTime, leaveTime, duration

## 🛠️ Development

### Run individual service

```bash
cd services/auth-service
npm install
npm run dev
```

### Database migrations

```bash
cd services/auth-service
npx prisma migrate dev
npx prisma studio
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Nginx RTMP Module
- HLS.js
- Socket.IO
- Prisma

---

**Made with ⚽ for football fans**
