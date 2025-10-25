"use client";

import { useState, useRef, useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductCard } from "./product-card";
import { Button } from "./button";
import { History, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export function RecentlyViewed() {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerSlide = 5; // Количество товаров на слайд (5 в ряд)
  const totalSlides = Math.ceil((recentlyViewed?.length || 0) / itemsPerSlide);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Автопрокрутка
  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000); // Переключение каждые 4 секунды
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, totalSlides]);

  // Останавливаем автопрокрутку при взаимодействии
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  // Не показываем секцию, если нет просмотренных товаров
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="pt-0 pb-2 sm:pt-0 sm:pb-3 lg:pt-1 lg:pb-4 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#ff6900] to-[#ff8533] rounded-lg">
              <History className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Просмотренные
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              title="Очистить историю"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products - горизонтальный скролл на мобильных и планшетах, слайдер на десктопе */}
        <div className="mb-6 sm:mb-8">
          {/* Мобильный и планшетный режим - горизонтальный скролл */}
          <div className="lg:hidden">
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recentlyViewed.map((product, index) => (
                <div key={`${product.sku}-${index}`} className="flex-shrink-0 w-48 sm:w-52 md:w-56">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Десктопный режим - слайдер */}
          <div className="hidden lg:block relative">
            {/* Navigation Arrows - вне контейнера */}
            {totalSlides > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-600 border border-gray-200 h-12 w-12 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  onClick={() => {
                    handleUserInteraction();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-600 border border-gray-200 h-12 w-12 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  onClick={() => {
                    handleUserInteraction();
                    goToNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Slider Container */}
            <div 
              ref={sliderRef}
              className="overflow-hidden"
              onMouseEnter={handleUserInteraction}
            >
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-5 gap-6">
                      {recentlyViewed
                        .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                        .map((product, index) => (
                          <ProductCard key={`${product.sku}-${index}`} product={product} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Navigation */}
            {totalSlides > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide 
                        ? 'w-8 h-3 bg-[#ff6900]' 
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => {
                      handleUserInteraction();
                      goToSlide(index);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
