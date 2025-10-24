"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Percent } from "lucide-react";
import { Button } from "./button";
import { ProductCard } from "./product-card";
import { useDiscountProducts } from "@/hooks/use-discount-products";
import { transitions } from "@/lib/view-transitions";

interface DiscountProductsSectionProps {
  title?: string;
  limit?: number;
  discountPrecent?: number;
  showViewAll?: boolean;
}

export function DiscountProductsSection({ 
  title = "Акционные товары",
  limit = 10,
  discountPrecent = 1,
  showViewAll = true
}: DiscountProductsSectionProps) {
  const router = useRouter();
  const [showCount, setShowCount] = useState(limit);
  
  const { data, isLoading, error } = useDiscountProducts({
    limit: showCount,
    discountPrecent,
    enabled: true
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;

  const handleViewAllNavigation = () => {
    transitions.slide(() => {
      // Переходим на каталог с фильтром по скидке
      router.push(`/catalog?discount=${discountPrecent}`);
    });
  };

  const handleShowMore = () => {
    setShowCount(prev => prev + 10);
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            {showViewAll && (
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-lg">
              <Percent className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          
          {showViewAll && (
            <Button
              variant="outline"
              onClick={handleViewAllNavigation}
              className="hidden sm:flex items-center gap-2 text-[#ff6900] border-[#ff6900] hover:bg-[#ff6900] hover:text-white transition-colors"
            >
              Все акции
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Products Grid - Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-5 gap-6 mb-8">
            {products.slice(0, 10).map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
          
          {products.length >= showCount && (
            <div className="text-center">
              <Button
                onClick={handleShowMore}
                variant="outline"
                className="px-8 py-3 text-[#ff6900] border-[#ff6900] hover:bg-[#ff6900] hover:text-white transition-colors"
              >
                Показать еще
              </Button>
            </div>
          )}
        </div>

        {/* Products Horizontal Scroll - Mobile/Tablet */}
        <div className="lg:hidden">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4">
            {products.map((product) => (
              <div key={product.sku} className="flex-shrink-0 w-48 sm:w-56">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          {showViewAll && (
            <div className="text-center mt-6">
              <Button
                onClick={handleViewAllNavigation}
                className="w-full sm:w-auto bg-[#ff6900] hover:bg-[#e55a00] text-white px-8 py-3"
              >
                Все акции
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
