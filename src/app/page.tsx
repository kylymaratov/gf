"use client";

import { Slider } from "@/components/ui/slider";
import { ProductsSection } from "@/components/ui/products-section";
import { PopularCategories } from "@/components/ui/popular-categories";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { useBanners } from "@/hooks/use-banners";
import { Truck, Shield, CreditCard } from "lucide-react";

export default function HomePage() {
  const { data: banners, isLoading, error } = useBanners();


  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg overflow-hidden relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite'
              }}></div>
              {/* Skeleton content */}
              <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                <div className="space-y-4 max-w-2xl">
                  <div className="h-8 bg-gray-400/50 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-400/40 rounded w-1/2 animate-pulse"></div>
                  <div className="h-12 bg-gray-400/60 rounded w-40 mt-6 animate-pulse"></div>
                </div>
              </div>
              {/* Navigation dots skeleton */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-8 h-2 bg-gray-400/50 rounded-full animate-pulse"></div>
                <div className="w-8 h-2 bg-gray-400/40 rounded-full animate-pulse"></div>
                <div className="w-8 h-2 bg-gray-400/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : error ? (
            <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Ошибка загрузки баннеров</p>
            </div>
          ) : (
            <Slider banners={banners || []} />
          )}
        </div>
          </section>

          {/* New Products Section */}
          <ProductsSection 
            title="Новые поступления товаров"
            limit={10}
            sort="newest"
          />

          {/* Popular Categories */}
          <PopularCategories />

          {/* Popular Products Section */}
          <ProductsSection 
            title="Популярные товары"
            limit={10}
            sort="popular"
          />

          {/* Recently Viewed Section */}
          <RecentlyViewed />

          {/* Features Section */}
      <section className="py-16 md:py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl dark:text-gray-100">
              Почему выбирают нас
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground dark:text-gray-400">
              Мы создаем лучший опыт покупок для наших клиентов
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 dark:bg-gray-800 p-4">
                <Truck className="h-8 w-8 text-primary dark:text-[#ff6900]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">Быстрая доставка</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Доставка по всей России от 1 до 3 дней. Бесплатная доставка от 3000 ₽
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 dark:bg-gray-800 p-4">
                <Shield className="h-8 w-8 text-primary dark:text-[#ff6900]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">Гарантия качества</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Все товары сертифицированы. Официальная гарантия производителя
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 dark:bg-gray-800 p-4">
                <CreditCard className="h-8 w-8 text-primary dark:text-[#ff6900]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold dark:text-gray-100">Удобная оплата</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Оплата картой, наличными или онлайн. Безопасные платежи
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
