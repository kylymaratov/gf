"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { useSimilarProducts } from "@/hooks/use-similar-products";

interface SimilarProductsSliderProps {
  productSlug: string;
  limit?: number;
}

export function SimilarProductsSlider({ productSlug, limit = 10 }: SimilarProductsSliderProps) {
  const { data: similarProducts, isLoading, error } = useSimilarProducts(productSlug, limit);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Обновляем количество элементов при изменении размера экрана
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // 2 товара в гриде на мобильных
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  if (isLoading) {
    const showSlider = window.innerWidth >= 640;
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Похожие товары</h2>
        
        {showSlider ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: itemsPerView }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 lg:w-64 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error || !similarProducts || similarProducts.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, similarProducts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };


  // Определяем, показывать ли слайдер или грид
  const showSlider = window.innerWidth >= 640;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Похожие товары</h2>
      
      {showSlider ? (
        // Слайдер для планшетов и десктопа
        <div className="relative">
          {/* Navigation Buttons */}
          {similarProducts.length > itemsPerView && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 h-10 w-10"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 h-10 w-10"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Products Slider */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * (itemsPerView === 2 ? 50 : itemsPerView === 3 ? 33.33 : 25)}%)` 
              }}
            >
              {similarProducts.map((product, index) => (
                <div 
                  key={product.sku}
                  className="flex-shrink-0 w-80 lg:w-64"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {similarProducts.length > itemsPerView && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-[#ff6900]' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Грид для мобильных устройств
        <div className="grid grid-cols-2 gap-3">
          {similarProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
