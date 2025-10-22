# 🛍️ GeneralHub - Интернет-магазин

Современный, полнофункциональный интернет-магазин на Next.js 15 с React 19, TypeScript, Tailwind CSS и shadcn/ui.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

---

## 📖 Документация

- **[🚀 Quick Start](./QUICKSTART.md)** - Быстрый старт за 5 минут
- **[🏗️ Architecture](./ARCHITECTURE.md)** - Архитектура проекта
- **[💡 Examples](./EXAMPLES.md)** - Примеры использования
- **[🚢 Deployment](./DEPLOYMENT.md)** - Руководство по деплою

---

## 🚀 Технологии

### Frontend
- **Next.js 15** - React фреймворк с App Router
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **shadcn/ui** - UI компоненты

### Управление состоянием
- **Zustand** - глобальное состояние (корзина)
- **TanStack Query (React Query)** - серверное состояние и кэширование

### Работа с API
- **Axios** - HTTP клиент с интерцепторами
- **js-cookie** - управление cookies (токены)

### UI/UX
- **Framer Motion** - анимации
- **Lucide React** - иконки
- **Sonner** - toast уведомления

### Формы
- **React Hook Form** - управление формами
- **Zod** - валидация схем

## 📦 Установка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Запуск production сервера
npm start
```

## 🔧 Настройка

1. Скопируйте `.env.local.example` в `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Настройте переменные окружения в `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── ui/               # shadcn/ui компоненты
│   ├── layout/           # Layout компоненты (Header, Footer)
│   ├── products/         # Компоненты товаров
│   └── providers/        # React провайдеры
├── hooks/                # Custom React hooks
│   ├── use-products.ts   # Hooks для работы с товарами
│   └── use-categories.ts # Hooks для работы с категориями
├── lib/                  # Утилиты
│   ├── api-client.ts     # Axios клиент
│   ├── query-client.ts   # React Query настройка
│   └── utils.ts          # Общие утилиты
├── services/             # API сервисы
│   ├── products.ts       # Сервис товаров
│   └── categories.ts     # Сервис категорий
├── stores/               # Zustand stores
│   └── cart-store.ts     # Состояние корзины
└── types/                # TypeScript типы
    └── index.ts          # Общие типы
```

## 🛠️ Основные возможности

### Корзина покупок
- Добавление/удаление товаров
- Изменение количества
- Подсчет общей стоимости
- Сохранение в localStorage

### Работа с API
- Автоматическое добавление токенов в запросы
- Обработка ошибок 401 (редирект на логин)
- Кэширование данных с React Query

### UI компоненты
- Адаптивный дизайн
- Темная/светлая тема (через CSS переменные)
- Toast уведомления
- Анимации

## 📝 API Endpoints (ожидаемые)

### Товары
- `GET /products` - список товаров (с фильтрами, пагинацией)
- `GET /products/:id` - товар по ID
- `GET /products/recommended` - рекомендованные товары
- `GET /products/search?q=` - поиск товаров

### Категории
- `GET /categories` - список категорий
- `GET /categories/:slug` - категория по slug

### Заказы (для будущей реализации)
- `POST /orders` - создать заказ
- `GET /orders` - список заказов пользователя
- `GET /orders/:id` - заказ по ID

## 🎨 Кастомизация темы

Тема настраивается через CSS переменные в `src/app/globals.css`.

Цвета определены как HSL значения:
```css
:root {
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  /* ... */
}
```

## 🔐 Авторизация

Токены хранятся в cookies (`access_token`). API клиент автоматически добавляет их в заголовки запросов.

При ошибке 401 пользователь перенаправляется на `/login`.

## 📱 Адаптивность

Проект полностью адаптивный с breakpoints Tailwind:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚧 TODO / Планы развития

- [ ] Страница каталога товаров
- [ ] Страница товара
- [ ] Страница корзины
- [ ] Страница оформления заказа
- [ ] Страница профиля
- [ ] Фильтрация и сортировка товаров
- [ ] Поиск товаров
- [ ] Избранное
- [ ] История заказов
- [ ] Отзывы о товарах

## 📄 Лицензия

MIT

## 👤 Автор

GeneralHub Team
