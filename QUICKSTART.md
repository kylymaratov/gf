# 🚀 Quick Start Guide

## Быстрый старт (5 минут)

### 1. Установка
```bash
# Клонируйте репозиторий (или используйте существующий)
cd generalhub-frontend

# Установите зависимости
npm install
```

### 2. Настройка переменных окружения
```bash
# Скопируйте пример конфигурации
cp .env.local.example .env.local

# Или создайте вручную
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

### 3. Запуск
```bash
# Запустите dev сервер
npm run dev
```

Откройте http://localhost:3000 в браузере.

## 📝 Первые шаги

### Создание своего первого компонента

1. **Создайте файл компонента:**
```bash
touch src/components/my-component.tsx
```

2. **Добавьте код:**
```tsx
// src/components/my-component.tsx
export function MyComponent() {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Мой компонент</h2>
      <p className="text-muted-foreground">Hello, GeneralHub!</p>
    </div>
  );
}
```

3. **Используйте в странице:**
```tsx
// src/app/page.tsx
import { MyComponent } from "@/components/my-component";

export default function HomePage() {
  return (
    <div className="container py-8">
      <MyComponent />
    </div>
  );
}
```

### Создание новой страницы

1. **Создайте директорию и файл:**
```bash
mkdir -p src/app/my-page
touch src/app/my-page/page.tsx
```

2. **Добавьте контент:**
```tsx
// src/app/my-page/page.tsx
export default function MyPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Моя страница</h1>
      <p>Контент страницы</p>
    </div>
  );
}
```

3. **Откройте:** http://localhost:3000/my-page

### Работа с корзиной

```tsx
"use client";

import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";

export function CartExample() {
  const { addItem, getTotalItems } = useCartStore();
  
  const demoProduct = {
    id: "1",
    name: "Тестовый товар",
    price: 999,
    images: ["/placeholder.jpg"],
    // ... другие поля
  };
  
  return (
    <div>
      <Button onClick={() => addItem(demoProduct, 1)}>
        Добавить в корзину
      </Button>
      <p>Товаров в корзине: {getTotalItems()}</p>
    </div>
  );
}
```

## 🎨 Кастомизация темы

### Изменение цветов

Отредактируйте `src/app/globals.css`:

```css
:root {
  /* Измените primary цвет */
  --primary: 220 90% 56%;  /* Синий */
  
  /* Или другой цвет */
  --primary: 142 76% 36%;  /* Зеленый */
}
```

### Использование кастомных цветов

```tsx
<div className="bg-primary text-primary-foreground">
  Primary background
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary background
</div>
```

## 📦 Подключение API

### 1. Настройте URL API

В `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### 2. Создайте сервис

```tsx
// src/services/my-service.ts
import apiClient from "@/lib/api-client";

export const myService = {
  async getData() {
    const { data } = await apiClient.get("/endpoint");
    return data;
  },
  
  async createData(payload: any) {
    const { data } = await apiClient.post("/endpoint", payload);
    return data;
  },
};
```

### 3. Создайте hook

```tsx
// src/hooks/use-my-data.ts
import { useQuery } from "@tanstack/react-query";
import { myService } from "@/services/my-service";

export function useMyData() {
  return useQuery({
    queryKey: ["myData"],
    queryFn: () => myService.getData(),
  });
}
```

### 4. Используйте в компоненте

```tsx
"use client";

import { useMyData } from "@/hooks/use-my-data";

export function MyDataComponent() {
  const { data, isLoading, error } = useMyData();
  
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

## 🔧 Полезные команды

```bash
# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Запуск production сервера
npm start

# Линтинг
npm run lint

# Форматирование кода
npm run format

# Проверка типов
npm run type-check
```

## 📚 Дополнительные ресурсы

- [README.md](./README.md) - Общая информация
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура проекта
- [EXAMPLES.md](./EXAMPLES.md) - Примеры кода
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Деплой

## 🆘 Частые проблемы

### Port 3000 already in use
```bash
# Убейте процесс на порту 3000
kill -9 $(lsof -ti:3000)

# Или используйте другой порт
PORT=3001 npm run dev
```

### Module not found
```bash
# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Проверьте типы
npm run type-check

# Перезапустите TypeScript сервер в VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Build errors
```bash
# Очистите кэш
rm -rf .next
npm run build
```

## 💡 Советы

1. **Используйте TypeScript** - это сэкономит время на отладке
2. **Следуйте структуре проекта** - держите код организованным
3. **Используйте Tailwind** - это ускорит разработку
4. **Кэшируйте данные** - используйте React Query
5. **Тестируйте на мобильных** - проект адаптивный

## 🎯 Следующие шаги

1. Изучите [EXAMPLES.md](./EXAMPLES.md) для примеров кода
2. Настройте подключение к вашему API
3. Кастомизируйте дизайн под ваши нужды
4. Добавьте новые функции
5. Подготовьтесь к деплою ([DEPLOYMENT.md](./DEPLOYMENT.md))

---

**Готовы начать? Запустите `npm run dev` и приступайте к разработке! 🚀**

