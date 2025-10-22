# Руководство по деплою GeneralHub

## 🚀 Варианты развертывания

### 1. Vercel (Рекомендуется)

Vercel - это платформа от создателей Next.js, оптимизированная для Next.js приложений.

#### Шаги:
```bash
# 1. Установить Vercel CLI
npm i -g vercel

# 2. Залогиниться
vercel login

# 3. Деплой
vercel
```

#### Настройка переменных окружения:
1. Перейдите в Dashboard Vercel
2. Выберите проект
3. Settings → Environment Variables
4. Добавьте: `NEXT_PUBLIC_API_URL`

### 2. Docker

#### Dockerfile
```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:3001/api
    depends_on:
      - api
```

#### Команды:
```bash
# Сборка
docker build -t generalhub-frontend .

# Запуск
docker run -p 3000:3000 generalhub-frontend

# Или с docker-compose
docker-compose up
```

### 3. Netlify

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"
```

#### Шаги:
```bash
# 1. Установить Netlify CLI
npm i -g netlify-cli

# 2. Залогиниться
netlify login

# 3. Деплой
netlify deploy --prod
```

### 4. VPS (Ubuntu/Debian)

#### 1. Подготовка сервера
```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Установить Nginx
sudo apt install -y nginx

# Установить PM2
sudo npm install -g pm2
```

#### 2. Деплой приложения
```bash
# Клонировать репозиторий
git clone https://github.com/your-repo/generalhub-frontend.git
cd generalhub-frontend

# Установить зависимости
npm install

# Создать .env.local
echo "NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api" > .env.local

# Собрать приложение
npm run build

# Запустить с PM2
pm2 start npm --name "generalhub" -- start
pm2 save
pm2 startup
```

#### 3. Настроить Nginx
```nginx
# /etc/nginx/sites-available/generalhub

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/generalhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL с Let's Encrypt
```bash
# Установить Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получить сертификат
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автообновление (добавлено автоматически)
sudo certbot renew --dry-run
```

## 🔧 Настройка окружения

### Переменные окружения

#### Production
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

#### Staging
```env
NEXT_PUBLIC_API_URL=https://api-staging.yourdomain.com/api
NODE_ENV=production
```

#### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
```

## 📊 Мониторинг

### Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### PM2 Мониторинг
```bash
# Просмотр логов
pm2 logs generalhub

# Мониторинг в реальном времени
pm2 monit

# Статус
pm2 status
```

## 🔄 CI/CD

### GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔐 Безопасность

### Headers (next.config.ts)
```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};
```

## 📝 Чек-лист перед деплоем

- [ ] Обновлены переменные окружения
- [ ] Протестировано на staging
- [ ] Проверены все API endpoints
- [ ] Настроены security headers
- [ ] Настроен SSL сертификат
- [ ] Настроен мониторинг
- [ ] Настроены бэкапы
- [ ] Проверена производительность
- [ ] Проверена SEO оптимизация
- [ ] Протестирована на мобильных устройствах

## 🐛 Отладка проблем

### Проблемы с build
```bash
# Очистить кэш
rm -rf .next
npm run build

# Проверить переменные окружения
env | grep NEXT_PUBLIC
```

### Проблемы с production
```bash
# Проверить логи
pm2 logs generalhub --lines 100

# Перезапустить приложение
pm2 restart generalhub

# Проверить статус
pm2 status
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи
2. Проверьте переменные окружения
3. Проверьте документацию платформы
4. Обратитесь в поддержку

