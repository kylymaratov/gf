"use client";

import { Slider } from "@/components/ui/slider";
import { ProductsSection } from "@/components/ui/products-section";
import { DiscountProductsSection } from "@/components/ui/discount-products-section";
import { TabbedProductsSection } from "@/components/ui/tabbed-products-section";
import { PopularCategories } from "@/components/ui/popular-categories";
import { RecentlyViewed } from "@/components/ui/recently-viewed";
import { ServicesSection } from "@/components/ui/services-section";
import { useBanners } from "@/hooks/use-banners";
import { Truck, Shield, CreditCard } from "lucide-react";

interface HomePageContentProps {
  initialBanners: any;
  initialError: string | null;
}

export function HomePageContent({ initialBanners, initialError }: HomePageContentProps) {
  // Используем клиентский хук для обновлений, но с начальными данными
  const { data: banners, isLoading, error } = useBanners();
  
  // Используем данные из хука или начальные данные
  const currentBanners = banners || initialBanners;
  const hasError = error || initialError;

  return (
    <div className="flex flex-col">
      {/* Hero Slider */}
      <section className="py-4 md:py-6">
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
          ) : hasError ? (
            <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Ошибка загрузки баннеров</p>
            </div>
          ) : (
            <Slider banners={currentBanners || []} />
          )}
        </div>
      </section>

      {/* Discount Products Section */}
      <DiscountProductsSection
        title="Акционные товары"
        limit={10}
        discountPrecent={1}
        showViewAll={true}
      />

      {/* Tabbed Products Section */}
      <TabbedProductsSection
        limit={10}
        showViewAll={true}
      />

      {/* Popular Categories */}
      <PopularCategories />

      {/* Recently Viewed Section */}
      <RecentlyViewed />

      {/* Features Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
              Почему выбирают нас
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Мы создаем лучший опыт покупок для наших клиентов
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 - Instagram */}
            <div className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
                <div className="text-white text-sm font-bold mb-2">GENERALHUB</div>
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-2">Подпишись на нас!</h3>
                <p className="text-gray-600 text-sm">
                  Подпишись на наш инстаграм, смотри обзоры новинок и участвуй в розыгрышах призов!
                </p>
              </div>
            </div>

            {/* Feature 2 - Community */}
            <div className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.461-2.189 4.667-1.293 1.206-2.896 1.933-4.754 2.102-1.858.169-3.461-.896-4.667-2.189-1.206-1.293-1.933-2.896-2.102-4.754-.169-1.858.896-3.461 2.189-4.667 1.293-1.206 2.896-1.933 4.754-2.102 1.858-.169 3.461.896 4.667 2.189 1.206 1.293 1.933 2.896 2.102 4.754z"/>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-2">Сообщество</h3>
                <p className="text-gray-600 text-sm">
                  Заходи в сообщество в Телеграм и узнавай крутые лайфхаки по выбору товаров!
                </p>
              </div>
            </div>

            {/* Feature 3 - Cashback */}
            <div className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
                <div className="text-white text-sm font-bold mb-2">CASHBACK</div>
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-2">Cashback с каждого заказа!</h3>
                <p className="text-gray-600 text-sm">
                  Получай бонусы с каждого купленного товара и обменивай на скидку!
                </p>
              </div>
            </div>

            {/* Feature 4 - Delivery */}
            <div className="bg-white rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <Truck className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 font-bold text-lg mb-2">Доставка по всей России</h3>
                <p className="text-gray-600 text-sm">
                  Доставим ваш заказ в кратчайшие сроки! При заказе от 3000 ₽, доставка будет бесплатной!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
}
