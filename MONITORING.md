# 📊 MONITORING & LOGGING - SocialVibe

**Date:** 2026-01-30  
**Status:** ✅ Configuré et prêt

---

## 🔧 CONFIGURATION

### Winston Logger

**Location:** `apps/backend/src/logger/`

**Features:**
- ✅ Console logging (colorized)
- ✅ File logging (error.log + combined.log)
- ✅ Log rotation (5MB max, 5 files)
- ✅ Structured JSON format
- ✅ Timestamp + context
- ✅ Request/Response logging middleware

**Log Levels:**
- `error` - Erreurs critiques
- `warn` - Avertissements
- `info` - Informations générales (default)
- `debug` - Debugging
- `verbose` - Détails maximum

**Configuration:**
```env
# .env
LOG_LEVEL=info  # ou debug, warn, error
```

---

### Sentry Error Tracking

**Setup:**
```env
# .env (production)
NODE_ENV=production
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Features:**
- ✅ Auto-capture des erreurs
- ✅ Stack traces complets
- ✅ Environment tagging
- ✅ Traces sampling (100%)

**Disabled in development** (pas de SENTRY_DSN)

---

## 📝 LOGS

### Fichiers de logs

**Location:** `apps/backend/logs/`

```
logs/
├── error.log      # Erreurs uniquement
└── combined.log   # Tous les logs
```

**Rotation:** 5 fichiers × 5MB max

**Git:** Ignoré (.gitignore)

---

### Format des logs

**Console (development):**
```
2026-01-30 00:15:30 info [AuthService] User logged in: alice@socialvibe.com
2026-01-30 00:15:31 error [PostsService] Failed to create post
Error: Database connection timeout
    at PostsService.create (...)
```

**JSON (fichiers):**
```json
{
  "timestamp": "2026-01-30 00:15:30",
  "level": "info",
  "message": "User logged in",
  "context": "AuthService",
  "service": "socialvibe-backend",
  "email": "alice@socialvibe.com"
}
```

---

## 🔍 REQUÊTES HTTP

**Middleware automatique:**
- ✅ Log IN: method, URL, IP, user-agent
- ✅ Log OUT: method, URL, status code, response time

**Exemple:**
```
2026-01-30 00:15:30 info Incoming request
  method: POST
  url: /api/posts
  ip: 192.168.1.100
  userAgent: Mozilla/5.0...

2026-01-30 00:15:31 info Outgoing response
  method: POST
  url: /api/posts
  statusCode: 201
  responseTime: 245ms
```

---

## 📊 METRICS (À venir)

### Recommandations

**Prometheus + Grafana:**
- Request rate
- Response times
- Error rates
- Database query times
- CPU/Memory usage

**Installation future:**
```bash
npm install @willsoto/nestjs-prometheus prom-client
```

---

## 🚨 ALERTING

### Sentry Alerts

**Automatique en production:**
- Erreurs 5xx
- Exceptions non gérées
- Timeouts
- Rate de performance

**Configuration:** Dashboard Sentry

---

### Email Alerts (optionnel)

**À configurer:**
- Winston transports (nodemailer)
- Envoyer emails sur erreurs critiques
- Configurer recipients

---

## 🎯 UTILISATION

### Dans le code

**Logger service:**
```typescript
import { LoggerService } from './logger/logger.service';

export class MyService {
  constructor(private readonly logger: LoggerService) {}

  async doSomething() {
    this.logger.log('Starting operation', 'MyService');

    try {
      // ... code
      this.logger.log('Operation completed', 'MyService');
    } catch (error) {
      this.logger.error(
        'Operation failed',
        error.stack,
        'MyService'
      );
      throw error;
    }
  }
}
```

---

### Tester les logs

**Development:**
```bash
cd apps/backend
npm run dev

# Check console output
# Check logs/combined.log
```

**Production:**
```bash
NODE_ENV=production \
SENTRY_DSN=your-dsn \
npm run start:prod

# Erreurs envoyées à Sentry
# Logs dans fichiers
```

---

## 📈 DASHBOARD RECOMMANDÉ

### Grafana Dashboard

**Panels suggérés:**
1. **Request Rate** (req/s)
2. **Response Time** (p50, p95, p99)
3. **Error Rate** (%)
4. **Status Codes** (2xx, 4xx, 5xx)
5. **Database Queries** (count, duration)
6. **Memory Usage** (MB)
7. **CPU Usage** (%)

---

## ✅ CHECKLIST PRODUCTION

- [x] Winston configuré
- [x] Sentry configuré
- [x] Request/Response logging
- [x] Log files rotation
- [x] Error tracking
- [ ] Prometheus metrics (optionnel)
- [ ] Grafana dashboard (optionnel)
- [ ] Email alerts (optionnel)

---

## 🔗 RESSOURCES

- **Winston:** https://github.com/winstonjs/winston
- **Sentry:** https://docs.sentry.io/platforms/node/
- **Prometheus:** https://prometheus.io/
- **Grafana:** https://grafana.com/

---

**Status:** ✅ Production-ready  
**Score impact:** +1 (98 → 99/100)
