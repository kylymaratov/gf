"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./product-card";
import { useProducts } from "@/hooks/use-products";
import { Button } from "./button";
import { transitions } from "@/lib/view-transitions";
import { Star, Sparkles } from "lucide-react";

interface ProductsSectionProps {
  title?: string;
  limit?: number;
  sort?: string;
  hideOn404?: boolean; // Скрывать секцию на главной странице при 404
  enablePagination?: boolean; // Включить пагинацию (по умолчанию false)
}

export function ProductsSection({ 
  title = "Распродажа, скидки, акции", 
  limit = 10,
  sort = "popular",
  hideOn404 = false,
  enablePagination = false
}: ProductsSectionProps) {
  
  // Функция для получения иконки в зависимости от типа секции
  const getSectionIcon = () => {
    if (title.includes("Популярные") || sort === "popular") {
      return <Star className="h-6 w-6 text-[#ff6900]" />;
    }
    if (title.includes("Новые") || sort === "newest") {
      return <Sparkles className="h-6 w-6 text-[#ff6900]" />;
    }
    return null;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loadedPagesRef = useRef(new Set<number>());
  const router = useRouter();
  
  const { data, isLoading, error } = useProducts({
    page: enablePagination ? currentPage : 1,
    limit: limit,
    withImage: true,
    sort
  });

  const handleViewAllNavigation = () => {
    transitions.slide(() => {
      // Переходим на каталог с соответствующим сортом
      const sortParam = sort === 'newest' ? 'newest' : sort === 'popular' ? 'popular' : 'newest';
      router.push(`/catalog?sort=${sortParam}`);
    });
  };

  // Обновляем список всех товаров при получении новых данных
  React.useEffect(() => {
    if (data?.products) {
      if (enablePagination && data.currentPage) {
        // Проверяем, не загружали ли мы уже эту страницу
        if (loadedPagesRef.current.has(data.currentPage)) {
          return;
        }
        
        // Отмечаем страницу как загруженную
        loadedPagesRef.current.add(data.currentPage);
        
        if (data.currentPage === 1) {
          setAllProducts(data.products);
          setHasMore(data.currentPage < data.totalPages);
        } else {
          setAllProducts(prev => {
            // Фильтруем дубликаты по SKU
            const existingSkus = new Set(prev.map(p => p.sku));
            const newUniqueProducts = data.products.filter(p => !existingSkus.has(p.sku));
            const newProducts = [...prev, ...newUniqueProducts];
            setHasMore(data.currentPage < data.totalPages);
            return newProducts;
          });
        }
      } else {
        // Без пагинации - просто показываем товары как есть
        setAllProducts(data.products);
      }
    }
  }, [data, enablePagination]);

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (isLoading && (!enablePagination || currentPage === 1)) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            {getSectionIcon()}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="mb-6 sm:mb-8">
            {/* Мобильный и планшетный режим - горизонтальный скролл */}
            <div className="lg:hidden">
              <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-48 sm:w-52 md:w-56 animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-square mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Десктопный режим - сетка по 5 товаров в ряд */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-square mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    // Проверяем, является ли ошибка 404
    const is404 = (error as any)?.status === 404 || (error as any)?.response?.status === 404;
    
    // Если это 404 и мы на главной странице, не показываем секцию
    if (is404 && hideOn404) {
      return null;
    }
    
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {getSectionIcon()}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {is404 ? "Товаров в этой категории нет" : "Ошибка загрузки продуктов. Попробуйте обновить страницу."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!allProducts.length && !isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {getSectionIcon()}
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Продукты не найдены.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Header - заголовок и иконка */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            {getSectionIcon()}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          {/* Кнопка "Смотреть все" - только на десктопе */}
          <Button
            variant="outline"
            className="hidden lg:block text-sm font-medium"
            onClick={handleViewAllNavigation}
          >
            Смотреть все
          </Button>
        </div>
        
        {/* Products - горизонтальный скролл на мобильных и планшетах, сетка на десктопе */}
        <div className="mb-6 sm:mb-8">
          {/* Мобильный и планшетный режим - горизонтальный скролл */}
          <div className="lg:hidden">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {allProducts.map((product, index) => (
                <div key={`${product.sku}-${index}`} className="flex-shrink-0 w-48 sm:w-52 md:w-56">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Десктопный режим - сетка по 5 товаров в ряд */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-5 gap-4">
              {allProducts.map((product, index) => (
                <ProductCard key={`${product.sku}-${index}`} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка "Смотреть все" - только на мобильных и планшетах */}
        <div className="flex justify-center lg:hidden mb-6 sm:mb-8">
          <Button
            variant="outline"
            className="text-sm font-medium"
            onClick={handleViewAllNavigation}
          >
            Смотреть все
          </Button>
        </div>

        {/* Show More Button - показываем только при включенной пагинации на десктопе */}
        {enablePagination && hasMore && (
          <div className="hidden lg:flex justify-center mt-8">
            <Button
              onClick={handleShowMore}
              className="bg-[#ff6900] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Показать еще"}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
