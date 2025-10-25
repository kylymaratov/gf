"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "./button";
import { ProductCard } from "./product-card";
import { useProducts } from "@/hooks/use-products";
import { transitions } from "@/lib/view-transitions";

interface TabbedProductsSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export function TabbedProductsSection({ 
  limit = 10,
  showViewAll = true
}: TabbedProductsSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'newest' | 'popular'>('newest');
  const [showCount, setShowCount] = useState(limit);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  
  const { data: newestData, isLoading: newestLoading, error: newestError } = useProducts({
    sort: 'newest',
    limit: showCount,
    page: 1,
    enabled: activeTab === 'newest'
  });

  const { data: popularData, isLoading: popularLoading, error: popularError } = useProducts({
    sort: 'popular',
    limit: showCount,
    page: 1,
    enabled: activeTab === 'popular'
  });

  const currentData = activeTab === 'newest' ? newestData : popularData;
  const isLoading = activeTab === 'newest' ? newestLoading : popularLoading;
  const error = activeTab === 'newest' ? newestError : popularError;
  const products = currentData?.products || [];
  const totalProducts = currentData?.totalProducts || 0;

  const handleViewAllNavigation = () => {
    transitions.slide(() => {
      const sortParam = activeTab === 'newest' ? 'newest' : 'popular';
      router.push(`/catalog?sort=${sortParam}`);
    });
  };

  const handleTabChange = (tab: 'newest' | 'popular') => {
    setActiveTab(tab);
    setShowCount(limit); // Сбрасываем счетчик при смене таба
  };

  const handleShowMore = () => {
    // Сохраняем текущую позицию скролла
    if (scrollContainerRef.current) {
      scrollPositionRef.current = scrollContainerRef.current.scrollLeft;
    }
    setIsLoadingMore(true);
    setShowCount(prev => prev + 10);
  };

  // Восстанавливаем позицию скролла после загрузки новых товаров
  useEffect(() => {
    if (scrollContainerRef.current && scrollPositionRef.current > 0) {
      scrollContainerRef.current.scrollLeft = scrollPositionRef.current;
    }
  }, [products.length]);

  // Сбрасываем состояние загрузки после получения данных
  useEffect(() => {
    if (!isLoading && isLoadingMore) {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore]);

  if (isLoading) {
    return (
      <section className="pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-8">
        <div className="container mx-auto px-4">
          {/* Tabs Skeleton */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Desktop Grid Skeleton */}
          <div className="hidden lg:grid grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Horizontal Scroll Skeleton */}
          <div className="lg:hidden">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 px-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-44 sm:w-52">
                  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-8">
      <div className="container mx-auto px-4">
        {/* Header with Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center justify-center sm:justify-start">
            {/* Tab Buttons */}
            <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-1 shadow-inner w-full sm:w-auto">
              <button
                onClick={() => handleTabChange('newest')}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 ${
                  activeTab === 'newest'
                    ? 'bg-white text-[#ff6900] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Sparkles className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${activeTab === 'newest' ? 'text-[#ff6900]' : 'text-gray-500'}`} />
                Новые
              </button>
              <button
                onClick={() => handleTabChange('popular')}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 ${
                  activeTab === 'popular'
                    ? 'bg-white text-[#ff6900] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Star className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${activeTab === 'popular' ? 'text-[#ff6900]' : 'text-gray-500'}`} />
                Популярные
              </button>
            </div>
          </div>
          
          {showViewAll && (
            <Button
              variant="outline"
              onClick={handleViewAllNavigation}
              className="hidden sm:flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2"
            >
              Все товары
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>

        {/* Products Grid - Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
          
          {products.length < totalProducts && (
            <div className="text-center">
              <Button
                onClick={handleShowMore}
                disabled={isLoadingMore}
                variant="outline"
                className="text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    Загрузка...
                  </div>
                ) : (
                  'Показать еще'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Products Horizontal Scroll - Mobile/Tablet */}
        <div className="lg:hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-4 px-1"
          >
            {products.map((product) => (
              <div key={product.sku} className="flex-shrink-0 w-44 sm:w-52">
                <ProductCard product={product} />
              </div>
            ))}
            
            {/* Кнопка "Показать еще" как последний элемент в слайдере */}
            {products.length < totalProducts && (
              <div className="flex-shrink-0 w-32 sm:w-36 flex items-center justify-center">
                <Button
                  onClick={handleShowMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="w-full h-32 sm:h-36 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 flex flex-col items-center justify-center gap-1 bg-white/50 backdrop-blur-sm border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-white/70 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="w-6 h-6 sm:w-7 sm:h-7 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      <span className="text-gray-600 font-medium">Загрузка...</span>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl sm:text-3xl text-gray-400">+</div>
                      <span className="text-gray-600 font-medium">Еще</span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {/* Кнопка "Все товары" снизу */}
          {showViewAll && (
            <div className="text-center mt-4 sm:mt-6">
              <Button
                onClick={handleViewAllNavigation}
                variant="outline"
                className="w-full sm:w-auto text-xs sm:text-sm px-4 py-2 sm:px-6 sm:py-2.5"
              >
                Все товары
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
