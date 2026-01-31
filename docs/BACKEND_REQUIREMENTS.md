# 🔧 Backend Requirements - SocialVibe

**Date**: 31 janvier 2025  
**Frontend Status**: ✅ Ready for integration  
**Backend Status**: ⏳ À implémenter  

---

## 🎯 OBJECTIF

Implémenter les changements backend nécessaires pour atteindre **26/30 (87%)** et rendre l'application production-ready.

**Timeline estimée**: 2-3 jours  
**Priorité**: 🔴 CRITIQUE (bloquant production)

---

## 1️⃣ COOKIES HTTPONLY (Priorité 1)

### ❌ Problème Actuel
```typescript
// Frontend (AVANT)
localStorage.setItem('token', response.data.access_token);  // ⚠️ XSS vulnerability
```

### ✅ Solution Backend

#### Installation
```bash
npm install cookie-parser
npm install -D @types/cookie-parser
```

#### Configuration (main.ts)
```typescript
import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable cookie parser
  app.use(cookieParser());
  
  // CORS with credentials
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,  // ✅ IMPORTANT!
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3000);
}
```

#### Auth Service (auth.service.ts)
```typescript
import { Response } from 'express';

@Injectable()
export class AuthService {
  async login(loginDto: LoginDto, res: Response) {
    // Validate user credentials
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate JWT
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    
    // ✅ Set HttpOnly cookie instead of returning token
    res.cookie('access_token', token, {
      httpOnly: true,      // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',  // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
    
    // Return user data only (NO TOKEN in response body)
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
    };
  }

  async register(registerDto: RegisterDto, res: Response) {
    // Create user
    const user = await this.usersService.create(registerDto);
    
    // Generate token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    // Set cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    
    return { user };
  }

  async logout(res: Response) {
    // Clear cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    
    return { message: 'Logged out successfully' };
  }
}
```

#### Auth Controller (auth.controller.ts)
```typescript
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response  // ✅ passthrough to allow response handling
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.register(registerDto, res);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
```

#### JWT Strategy (jwt.strategy.ts)
```typescript
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // ✅ Extract JWT from cookie instead of Authorization header
        return req.cookies?.access_token || null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
```

### 🧪 Tests Backend
```bash
# Test login sets cookie
curl -v -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  -c cookies.txt

# Verify cookie
cat cookies.txt
# Should contain: access_token=... HttpOnly Secure

# Test authenticated request
curl -v -X GET http://localhost:3000/posts \
  -b cookies.txt

# Test logout clears cookie
curl -v -X POST http://localhost:3000/auth/logout \
  -b cookies.txt
```

### ✅ Checklist
- [ ] cookie-parser installé
- [ ] CORS credentials activé
- [ ] JWT extrait du cookie (pas header)
- [ ] Login retourne cookie HttpOnly
- [ ] Register retourne cookie HttpOnly
- [ ] Logout clear le cookie
- [ ] Tests curl passent
- [ ] Frontend fonctionne avec cookies

---

## 2️⃣ ENDPOINTS STORIES (Priorité 2)

### ❌ Problème Actuel
```typescript
// Frontend utilise mock data
stories: mockStories.stories  // Pas de vrai backend
```

### ✅ Solution Backend

#### Prisma Schema
```prisma
model Story {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  media     String   // URL de l'image/vidéo
  type      StoryType @default(IMAGE)
  createdAt DateTime @default(now())
  expiresAt DateTime // 24h après création
  views     StoryView[]
  
  @@index([userId])
  @@index([expiresAt])
}

model StoryView {
  id        String   @id @default(uuid())
  storyId   String
  story     Story    @relation(fields: [storyId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  viewedAt  DateTime @default(now())
  
  @@unique([storyId, userId])
}

enum StoryType {
  IMAGE
  VIDEO
}
```

#### Stories Service
```typescript
@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async getStories(userId: string) {
    const now = new Date();
    
    // Get stories from friends + own stories
    const stories = await this.prisma.story.findMany({
      where: {
        expiresAt: { gte: now },  // Not expired
        OR: [
          { userId },  // Own stories
          {
            user: {
              followers: {
                some: { followerId: userId },  // Friends' stories
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        views: {
          where: { userId },
          select: { id: true },
        },
        _count: {
          select: { views: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    // Group by user
    const grouped = stories.reduce((acc, story) => {
      const existing = acc.find(g => g.userId === story.userId);
      if (existing) {
        existing.stories.push(story);
      } else {
        acc.push({
          userId: story.userId,
          user: story.user,
          stories: [story],
        });
      }
      return acc;
    }, []);
    
    return grouped;
  }

  async createStory(userId: string, createDto: CreateStoryDto) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    return this.prisma.story.create({
      data: {
        userId,
        media: createDto.media,
        type: createDto.type || 'IMAGE',
        expiresAt,
      },
      include: {
        user: true,
      },
    });
  }

  async viewStory(storyId: string, userId: string) {
    return this.prisma.storyView.upsert({
      where: {
        storyId_userId: { storyId, userId },
      },
      create: { storyId, userId },
      update: { viewedAt: new Date() },
    });
  }
}
```

#### Stories Controller
```typescript
@Controller('stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Get()
  getStories(@CurrentUser() user: any) {
    return this.storiesService.getStories(user.id);
  }

  @Post()
  createStory(@CurrentUser() user: any, @Body() createDto: CreateStoryDto) {
    return this.storiesService.createStory(user.id, createDto);
  }

  @Post(':id/view')
  viewStory(@Param('id') id: string, @CurrentUser() user: any) {
    return this.storiesService.viewStory(id, user.id);
  }
}
```

### ✅ Checklist
- [ ] Prisma schema créé
- [ ] Migration appliquée
- [ ] StoriesService implémenté
- [ ] GET /stories fonctionne
- [ ] POST /stories fonctionne
- [ ] Stories expirent après 24h
- [ ] Frontend connecté aux vrais endpoints

---

## 3️⃣ ENDPOINTS NOTIFICATIONS (Priorité 3)

### ✅ Solution Backend

#### Prisma Schema
```prisma
model Notification {
  id        String   @id @default(uuid())
  userId    String   // Recipient
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  actorId   String?  // Who triggered the notification
  actor     User?    @relation("NotificationActor", fields: [actorId], references: [id], onDelete: Cascade)
  postId    String?
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  commentId String?
  comment   Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([read])
}

enum NotificationType {
  LIKE
  COMMENT
  FOLLOW
  MENTION
}
```

#### Notifications Service
```typescript
@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        post: {
          select: {
            id: true,
            caption: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,  // Security: only own notifications
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  // Helper to create notifications
  async createNotification(data: CreateNotificationDto) {
    return this.prisma.notification.create({ data });
  }
}
```

### ✅ Checklist
- [ ] Prisma schema créé
- [ ] NotificationsService implémenté
- [ ] GET /notifications fonctionne
- [ ] PATCH /notifications/:id/read fonctionne
- [ ] Frontend connecté

---

## 4️⃣ RATE LIMITING (Bonus)

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // Time window in seconds
      limit: 100,   // Max requests per window
    }),
  ],
})
```

---

## 🧪 TESTS D'INTÉGRATION

### Test complet Login → Posts
```bash
#!/bin/bash

# 1. Login
curl -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 2. Get posts (with cookie)
curl -b cookies.txt http://localhost:3000/posts

# 3. Create post
curl -b cookies.txt -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"caption":"Test from cookies!","image":"https://picsum.photos/400"}'

# 4. Get stories
curl -b cookies.txt http://localhost:3000/stories

# 5. Logout
curl -b cookies.txt -X POST http://localhost:3000/auth/logout
```

---

## 📋 CHECKLIST COMPLÈTE

### Sécurité
- [ ] cookie-parser installé
- [ ] CORS credentials configuré
- [ ] JWT extrait du cookie
- [ ] Cookies HttpOnly/Secure/SameSite
- [ ] Logout clear les cookies

### Endpoints
- [ ] GET /stories implémenté
- [ ] POST /stories implémenté
- [ ] GET /notifications implémenté
- [ ] PATCH /notifications/:id/read implémenté

### Base de données
- [ ] Prisma schema Story créé
- [ ] Prisma schema Notification créé
- [ ] Migrations appliquées
- [ ] Seeds mis à jour

### Tests
- [ ] Tests curl passent
- [ ] Frontend fonctionne avec backend
- [ ] Login/logout fonctionnent
- [ ] Stories affichées
- [ ] Notifications affichées

---

## 🎯 RÉSULTAT ATTENDU

Après implémentation :
- ✅ Score Sécurité: 4/5 → 5/5
- ✅ Score Architecture: 4/5 → 5/5
- ✅ **SCORE TOTAL: 24/30 → 26/30 (87%)**
- ✅ **PRODUCTION READY** 🚀

---

**Temps estimé total**: 2-3 jours  
**Complexité**: Moyenne  
**Bloquant**: OUI (critique pour production)

---

*Créé le 31 janvier 2025 | Frontend ready | À implémenter par équipe backend*
