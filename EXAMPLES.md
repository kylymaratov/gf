# Примеры использования

## 📦 Работа с корзиной

### Добавление товара в корзину
```tsx
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success("Товар добавлен в корзину");
  };
  
  return (
    <button onClick={handleAddToCart}>
      Добавить в корзину
    </button>
  );
}
```

### Отображение количества товаров
```tsx
import { useCartStore } from "@/stores/cart-store";

function CartBadge() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  return <span>{totalItems}</span>;
}
```

### Управление количеством
```tsx
import { useCartStore } from "@/stores/cart-store";

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();
  
  return (
    <div>
      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
        -
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
        +
      </button>
      <button onClick={() => removeItem(item.product.id)}>
        Удалить
      </button>
    </div>
  );
}
```

## 🔍 Загрузка данных с API

### Получение списка товаров
```tsx
"use client";

import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/products/product-card";

export function ProductsGrid() {
  const { data, isLoading, error } = useProducts();
  
  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;
  
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Получение товара по ID
```tsx
"use client";

import { useProduct } from "@/hooks/use-products";

export function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading } = useProduct(params.id);
  
  if (isLoading) return <div>Загрузка...</div>;
  if (!product) return <div>Товар не найден</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>{product.price} ₽</span>
    </div>
  );
}
```

### Фильтрация товаров
```tsx
"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductFilters } from "@/types";

export function FilteredProducts() {
  const [filters, setFilters] = useState<ProductFilters>({
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "price",
    sortOrder: "asc",
  });
  
  const { data } = useProducts(filters);
  
  return (
    <div>
      <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
        <option value="">Все категории</option>
        {/* ... */}
      </select>
      
      <select onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}>
        <option value="price">По цене</option>
        <option value="rating">По рейтингу</option>
        <option value="newest">Новинки</option>
      </select>
      
      {/* Display products */}
    </div>
  );
}
```

## 📝 Формы с валидацией

### Форма заказа
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const orderSchema = z.object({
  fullName: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Неверный email"),
  phone: z.string().min(10, "Неверный номер телефона"),
  address: z.string().min(5, "Укажите адрес"),
});

type OrderForm = z.infer<typeof orderSchema>;

export function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });
  
  const onSubmit = (data: OrderForm) => {
    console.log(data);
    // Отправка на сервер
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("fullName")} placeholder="ФИО" />
        {errors.fullName && <span>{errors.fullName.message}</span>}
      </div>
      
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      
      <div>
        <input {...register("phone")} placeholder="Телефон" />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>
      
      <div>
        <textarea {...register("address")} placeholder="Адрес" />
        {errors.address && <span>{errors.address.message}</span>}
      </div>
      
      <Button type="submit">Оформить заказ</Button>
    </form>
  );
}
```

## 🎨 Использование UI компонентов

### Кнопки
```tsx
import { Button } from "@/components/ui/button";

function ButtonExamples() {
  return (
    <div>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}
```

### Toast уведомления
```tsx
import { toast } from "sonner";

function ToastExamples() {
  return (
    <div>
      <button onClick={() => toast.success("Успешно!")}>
        Success
      </button>
      
      <button onClick={() => toast.error("Ошибка!")}>
        Error
      </button>
      
      <button onClick={() => toast.info("Информация")}>
        Info
      </button>
      
      <button onClick={() => toast.warning("Предупреждение")}>
        Warning
      </button>
      
      <button onClick={() => toast.promise(
        fetch("/api/data"),
        {
          loading: "Загрузка...",
          success: "Готово!",
          error: "Ошибка!",
        }
      )}>
        Promise
      </button>
    </div>
  );
}
```

## 🔄 Мутации данных

### Создание заказа
```tsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData) => {
      const { data } = await apiClient.post("/orders", orderData);
      return data;
    },
    onSuccess: () => {
      // Инвалидируем кэш заказов
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Заказ оформлен!");
    },
    onError: (error) => {
      toast.error("Ошибка при оформлении заказа");
      console.error(error);
    },
  });
}

export function CheckoutButton({ orderData }) {
  const createOrder = useCreateOrder();
  
  return (
    <button
      onClick={() => createOrder.mutate(orderData)}
      disabled={createOrder.isPending}
    >
      {createOrder.isPending ? "Оформление..." : "Оформить заказ"}
    </button>
  );
}
```

### Оптимистичное обновление
```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useAddToFavorites() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      await apiClient.post(`/favorites/${productId}`);
    },
    // Оптимистичное обновление
    onMutate: async (productId) => {
      // Отменяем текущие запросы
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      
      // Получаем предыдущее состояние
      const previousFavorites = queryClient.getQueryData(["favorites"]);
      
      // Обновляем кэш оптимистично
      queryClient.setQueryData(["favorites"], (old: any) => [
        ...old,
        productId,
      ]);
      
      // Возвращаем контекст для rollback
      return { previousFavorites };
    },
    // В случае ошибки - откат
    onError: (err, productId, context) => {
      queryClient.setQueryData(["favorites"], context?.previousFavorites);
    },
    // После завершения - синхронизация с сервером
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
```

## 🎯 Утилиты

### Форматирование цены
```tsx
import { formatPrice } from "@/lib/utils";

const price = formatPrice(1234.56); // "1 234,56 ₽"
const priceUSD = formatPrice(1234.56, { currency: "USD" }); // "$1,234.56"
```

### Форматирование даты
```tsx
import { formatDate } from "@/lib/utils";

const date = formatDate(new Date(), "dd.MM.yyyy"); // "16.10.2025"
const dateTime = formatDate(new Date(), "dd.MM.yyyy HH:mm"); // "16.10.2025 14:30"
```

### Объединение классов
```tsx
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  condition && "conditional-class",
  { "object-class": true }
); // "base-class conditional-class object-class"
```

## 🔐 Работа с токенами

### Сохранение токена после логина
```tsx
const Cookies = {
  set: (name: string, value: string) => {
    document.cookie = `${name}=${value}; path=/; max-age=86400`;
  }
};

async function login(email: string, password: string) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  
  // Сохраняем токен
  Cookies.set("access_token", data.token);
  
  // Редирект
  window.location.href = "/";
}
```

### Выход из системы
```tsx
const Cookies = {
  remove: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

function logout() {
  Cookies.remove("access_token");
  window.location.href = "/login";
}
```

## 📱 Адаптивность

### Адаптивная сетка
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* items */}
</div>
```

### Условное отображение
```tsx
<div className="hidden md:block">
  Видно только на desktop
</div>

<div className="block md:hidden">
  Видно только на mobile
</div>
```

### Адаптивные отступы
```tsx
<div className="p-4 md:p-6 lg:p-8">
  {/* content */}
</div>
```

## 🎨 Темная тема

### Переключение темы
```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
  
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

### Использование в стилях
```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Адаптивный контент
</div>
```

