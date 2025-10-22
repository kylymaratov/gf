# Архитектура проекта GeneralHub

## 📋 Обзор

GeneralHub - это современный интернет-магазин, построенный на Next.js 15 с использованием App Router, React 19 и TypeScript.

## 🏗️ Архитектурные решения

### 1. App Router (Next.js 15)
- Использует новый App Router для маршрутизации
- Server Components по умолчанию для оптимизации производительности
- Client Components только там, где нужна интерактивность

### 2. Управление состоянием

#### Zustand (Клиентское состояние)
- **Корзина покупок** - `src/stores/cart-store.ts`
- Сохранение в localStorage для персистентности
- Легковесная альтернатива Redux

#### TanStack Query (Серверное состояние)
- Кэширование данных с API
- Автоматическая ре-валидация
- Оптимистичные обновления
- Hooks в `src/hooks/`

### 3. Работа с API

#### API Client (`src/lib/api-client.ts`)
- Axios с настроенными интерцепторами
- Автоматическое добавление токенов авторизации
- Обработка ошибок 401 (редирект на логин)
- Централизованная конфигурация

#### Services Layer (`src/services/`)
- Инкапсуляция логики работы с API
- Типизированные запросы и ответы
- Разделение по доменам (products, categories, orders)

### 4. Типизация

#### TypeScript
- Строгая типизация (`strict: true`)
- Общие типы в `src/types/index.ts`
- Type safety для всех API запросов

#### Zod
- Валидация схем данных
- Интеграция с React Hook Form
- Runtime type checking

## 📁 Структура директорий

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout с провайдерами
│   ├── page.tsx               # Главная страница
│   ├── products/              # Страницы товаров
│   ├── cart/                  # Корзина
│   ├── profile/               # Профиль пользователя
│   ├── about/                 # О компании
│   ├── contacts/              # Контакты
│   └── categories/            # Категории
│
├── components/                # React компоненты
│   ├── ui/                    # shadcn/ui компоненты
│   │   └── button.tsx         # Кнопка (и другие UI компоненты)
│   ├── layout/                # Layout компоненты
│   │   ├── header.tsx         # Шапка сайта
│   │   └── footer.tsx         # Футер
│   ├── products/              # Компоненты товаров
│   │   └── product-card.tsx   # Карточка товара
│   └── providers/             # React Context провайдеры
│       ├── query-provider.tsx # React Query Provider
│       └── toast-provider.tsx # Toast уведомления
│
├── hooks/                     # Custom React hooks
│   ├── use-products.ts        # Hooks для товаров
│   └── use-categories.ts      # Hooks для категорий
│
├── lib/                       # Утилиты и конфигурация
│   ├── api-client.ts          # Axios instance
│   ├── query-client.ts        # React Query config
│   ├── utils.ts               # Общие утилиты
│   └── env.ts                 # Environment variables
│
├── services/                  # API сервисы
│   ├── products.ts            # Сервис товаров
│   └── categories.ts          # Сервис категорий
│
├── stores/                    # Zustand stores
│   └── cart-store.ts          # Состояние корзины
│
└── types/                     # TypeScript типы
    └── index.ts               # Общие типы
```

## 🔄 Поток данных

### 1. Загрузка данных с сервера

```
Component → Custom Hook → React Query → Service → API Client → API
```

Пример:
```tsx
// Component
const { data, isLoading } = useProducts();

// Hook (use-products.ts)
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  });
}

// Service (products.ts)
export const productsService = {
  async getProducts() {
    const { data } = await apiClient.get('/products');
    return data;
  }
};

// API Client (api-client.ts)
export const apiClient = axios.create({
  baseURL: API_URL,
  // interceptors...
});
```

### 2. Клиентское состояние (Корзина)

```
Component → Zustand Store → localStorage
```

Пример:
```tsx
// Component
const addItem = useCartStore((state) => state.addItem);
addItem(product, 1);

// Store (cart-store.ts)
export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) => {
        // logic...
      },
    }),
    { name: 'cart-storage' }
  )
);
```

## 🎨 Стилизация

### Tailwind CSS
- Utility-first подход
- Адаптивный дизайн
- Темная/светлая тема через CSS переменные

### shadcn/ui
- Готовые компоненты
- Полная кастомизация
- На базе Radix UI

### CSS Переменные
```css
:root {
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  /* ... */
}

.dark {
  --primary: 0 0% 98%;
  /* ... */
}
```

## 🔐 Аутентификация

### Токены
- Хранение в cookies (`access_token`)
- Автоматическое добавление в заголовки через interceptor
- Обработка истечения токена (401)

### Потокобработки
```
1. Пользователь логинится
2. API возвращает токен
3. Токен сохраняется в cookies
4. Все последующие запросы включают токен
5. При 401 → редирект на /login
```

## 📦 Кэширование

### React Query
- **staleTime**: 1 минута
- **gcTime**: 5 минут
- **retry**: 1 попытка
- **refetchOnWindowFocus**: отключено

### Стратегия
- Кэширование по queryKey
- Автоматическая инвалидация
- Оптимистичные обновления для мутаций

## 🚀 Производительность

### Next.js Оптимизации
- Server Components по умолчанию
- Автоматический code splitting
- Image optimization (next/image)
- Font optimization

### Клиентская оптимизация
- React Query для кэширования
- localStorage для корзины
- Lazy loading компонентов
- Suspense boundaries

## 🧪 Разработка

### Линтинг и форматирование
```bash
npm run lint          # ESLint
npm run format        # Prettier
npm run format:check  # Проверка форматирования
npm run type-check    # TypeScript проверка
```

### Переменные окружения
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📝 Соглашения о коде

### Именование
- **Компоненты**: PascalCase (`ProductCard`)
- **Файлы компонентов**: kebab-case (`product-card.tsx`)
- **Hooks**: camelCase с префиксом "use" (`useProducts`)
- **Утилиты**: camelCase (`formatPrice`)
- **Константы**: UPPER_SNAKE_CASE (`API_URL`)

### Структура компонента
```tsx
// 1. Imports
import { useState } from "react";

// 2. Types
interface Props {
  // ...
}

// 3. Component
export function Component({ prop }: Props) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => {};
  
  // 3.3 Render
  return <div>...</div>;
}
```

### Файловая структура
- Один компонент = один файл
- Группировка по функциональности
- Индексные файлы для экспортов

## 🔄 Будущие улучшения

- [ ] Server Actions для мутаций
- [ ] Streaming SSR
- [ ] ISR для статических страниц
- [ ] Optimistic UI updates
- [ ] Error boundaries
- [ ] Analytics интеграция
- [ ] A/B тестирование
- [ ] PWA поддержка

