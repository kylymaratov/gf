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
}

export function ProductsSection({ 
  title = "Распродажа, скидки, акции", 
  limit = 10,
  sort = "popular"
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
    page: currentPage,
    limit: 10, // Всегда загружаем по 10 товаров
    withImage: true,
    sort
  });

  const handleViewAllNavigation = () => {
    transitions.slide(() => {
      router.push('/products');
    });
  };

  // Обновляем список всех товаров при получении новых данных
  React.useEffect(() => {
    if (data?.products && data.currentPage) {
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
    }
  }, [data]);

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (isLoading && currentPage === 1) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {getSectionIcon()}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-square mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            {getSectionIcon()}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground dark:text-gray-400">
              Ошибка загрузки продуктов. Попробуйте обновить страницу.
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground dark:text-gray-400">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            {getSectionIcon()}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          </div>
          <Button
            variant="outline"
            className="text-sm font-medium w-full sm:w-auto"
            onClick={handleViewAllNavigation}
          >
            Смотреть все
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allProducts.map((product, index) => (
            <ProductCard key={`${product.sku}-${index}`} product={product} />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="text-center mt-8">
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
