# StreamSync Lite Backend

NestJS backend for StreamSync Lite mobile application.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Testing](#testing)

## 🎯 Overview

RESTful API built with NestJS providing:
- User authentication (JWT)
- YouTube video metadata fetching
- Progress tracking and favorites
- Push notifications via Firebase Admin SDK
- FCM token management
- Test Push endpoint for QA

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: Passport JWT
- **Push Notifications**: Firebase Admin SDK
- **Validation**: class-validator
- **Logging**: Pino
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── guards/       # Auth guards
│   │   ├── strategies/   # Passport strategies
│   │   └── auth.*.ts
│   ├── users/            # User management
│   ├── videos/           # Video management & YouTube integration
│   ├── notifications/    # Push notification service & queue
│   ├── database/         # TypeORM entities & migrations
│   │   ├── entities/     # Database entities
│   │   └── migrations/   # Database migrations
│   ├── common/           # Shared utilities
│   │   ├── dto/         # Common DTOs (pagination, etc.)
│   │   ├── filters/     # Exception filters
│   │   └── logger/      # Logger configuration
│   ├── config/           # Configuration files
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
├── Dockerfile
└── README.md
```

## 🚀 Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase project with Admin SDK credentials
- YouTube Data API v3 key

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# - Database connection
# - JWT secrets
# - Firebase Admin SDK credentials
# - YouTube API key
```

### Database Setup

```bash
# Generate migration
npm run migration:generate -- -n InitialMigration

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Development

```bash
# Start in development mode
npm run start:dev

# Start in debug mode
npm run start:debug

# Build for production
npm run build

# Start production build
npm run start:prod
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=streamsync
DB_PASSWORD=your_password
DB_DATABASE=streamsync_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=30d

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email

# YouTube
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
YOUTUBE_CACHE_TTL_MINUTES=10

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
TEST_PUSH_RATE_LIMIT_TTL=3600
TEST_PUSH_RATE_LIMIT_MAX=5
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Videos

- `GET /api/videos/latest?channelId={id}&limit=10` - Get latest videos
- `GET /api/videos/{videoId}` - Get video details
- `POST /api/videos/progress` - Save video progress (authenticated)
- `POST /api/videos/{videoId}/favorite` - Toggle favorite (authenticated)

### Users

- `POST /api/users/:id/fcmToken` - Register FCM token (authenticated)
- `DELETE /api/users/:id/fcmToken` - Delete FCM token (authenticated)

### Notifications

- `GET /api/notifications?limit=50&since={timestamp}` - Get user notifications (authenticated)
- `POST /api/notifications/send-test` - Send test push notification (authenticated, rate-limited)
- `POST /api/notifications/mark-read` - Mark notification as read (authenticated)
- `DELETE /api/notifications/:id` - Delete notification (authenticated)

### Health

- `GET /api/health` - Health check endpoint

## 🗄️ Database Schema

### Tables

- `users` - User accounts
- `videos` - Video metadata (from YouTube)
- `progress` - User video progress tracking
- `favorites` - User favorite videos
- `notifications` - Notification records
- `notification_jobs` - Push notification job queue
- `fcm_tokens` - User FCM device tokens

See entities in `src/database/entities/` for detailed schema.

## 🔔 Push Notifications

The backend uses a DB-backed queue system:

1. Notification is created → stored in `notifications` table
2. Job is enqueued → stored in `notification_jobs` table
3. Worker process picks up pending jobs
4. Firebase Admin SDK sends push to user's FCM tokens
5. Job status updated (sent/failed/DLQ)
6. Retry with exponential backoff on failure

### Test Push Feature

The `/api/notifications/send-test` endpoint:
- Accepts title and body from authenticated user
- Creates notification and enqueues job
- Rate limited: 5 requests per hour per user
- Supports idempotency via request headers

## 🚢 Deployment

### AWS Free Tier Deployment

#### Option 1: EC2 + RDS

1. **Create RDS PostgreSQL instance** (Free Tier)
   - Note connection details

2. **Launch EC2 t2.micro instance**
   - Ubuntu 22.04 LTS
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

3. **Setup on EC2**
   ```bash
   # SSH into EC2
   ssh -i your-key.pem ubuntu@your-ec2-ip

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install NGINX
   sudo apt-get install -y nginx

   # Clone repository
   git clone your-repo.git
   cd streamsync-lite/backend

   # Install dependencies
   npm install

   # Build
   npm run build

   # Setup environment variables (use AWS Parameter Store)
   # Copy .env or set environment variables

   # Run migrations
   npm run migration:run

   # Start with PM2
   pm2 start dist/main.js --name streamsync-backend
   pm2 save
   pm2 startup
   ```

4. **Configure NGINX**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL (optional)**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

#### Option 2: Elastic Beanstalk

1. Create Node.js platform application
2. Upload built application
3. Configure environment variables
4. Deploy

### Environment Variables in Production

Use AWS Systems Manager Parameter Store:

```bash
aws ssm put-parameter --name "/streamsync/db/password" --value "secret" --type SecureString
aws ssm put-parameter --name "/streamsync/jwt/secret" --value "secret" --type SecureString
# ... etc
```

Update code to fetch from Parameter Store instead of `.env`.

### Docker Deployment

```bash
# Build image
docker build -t streamsync-backend .

# Run container
docker run -p 3000:3000 --env-file .env streamsync-backend
```

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📊 Monitoring & Logging

- **Logging**: Structured logs with Pino
- **Health Check**: `/api/health` endpoint
- **CloudWatch**: Configure log groups for production

## 🔒 Security Best Practices

- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation
- ✅ Parameterized queries (TypeORM)
- ✅ No secrets in code

## 📝 API Documentation

When running, visit:
- Swagger UI (if configured): `http://localhost:3000/api/docs`
- Health check: `http://localhost:3000/api/health`

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use class-validator for DTOs
3. Write unit tests for services
4. Use ESLint and Prettier
5. Follow NestJS best practices

## 📄 License

Hackathon project - See main README.
