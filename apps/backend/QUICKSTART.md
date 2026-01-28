# 🚀 Backend Quick Start

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm >= 9

---

## 1. Database Setup

### Option A: Local PostgreSQL

```bash
# Create database
createdb socialvibe

# Or using psql
psql -U postgres
CREATE DATABASE socialvibe;
\q
```

### Option B: Docker

```bash
docker-compose up -d
```

---

## 2. Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars)
- `PORT` - Server port (default: 3000)

---

## 3. Install & Run

```bash
# Install dependencies (from monorepo root)
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

Server will start at: **http://localhost:3000**

---

## 4. Test the API

### Register a new user

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "username": "johndoe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

You'll receive a JWT token. Use it for authenticated requests:

```bash
export TOKEN="your-jwt-token-here"

# Get current user profile
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Create a post
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "caption": "My first post!",
    "image": "https://example.com/image.jpg"
  }'

# Get all posts (with pagination)
curl "http://localhost:3000/posts?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 5. Available Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile (protected)

### Posts
- `GET /posts` - Get all posts (paginated, protected)
- `GET /posts/:id` - Get single post (protected)
- `POST /posts` - Create post (protected)
- `PATCH /posts/:id` - Update post (protected)
- `DELETE /posts/:id` - Delete post (protected)
- `POST /posts/:id/like` - Toggle like (protected)
- `GET /posts/user/:userId` - Get user posts (protected)

### Comments
- `GET /posts/:postId/comments` - Get post comments
- `POST /posts/:postId/comments` - Create comment
- `DELETE /comments/:id` - Delete comment

---

## 6. Prisma Studio (Optional)

Open Prisma Studio to view/edit database:

```bash
npx prisma studio
```

Opens at: **http://localhost:5555**

---

## Troubleshooting

### Can't connect to database
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify DATABASE_URL in `.env`
- Check database exists: `psql -l`

### Port already in use
- Change PORT in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill`

### Migration errors
- Reset database: `npx prisma migrate reset`
- Re-run migrations: `npx prisma migrate dev`

---

**Need help?** Check the main [Backend README](./README.md)
