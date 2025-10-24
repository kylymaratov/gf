"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { useProducts } from "@/hooks/use-products";
import { productsService } from "@/services/products";
import { transitions } from "@/lib/view-transitions";

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Получаем поисковый запрос из URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Поиск товаров
  const { data: productsResponse, isLoading, error } = useProducts({
    enabled: searchQuery.length > 0
  });
  
  const products = productsResponse?.products || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Обновляем URL с поисковым запросом
      transitions.slide(() => {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      });
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    transitions.slide(() => {
      router.push('/search');
    });
  };

  const handleProductClick = (slug: string) => {
    transitions.slide(() => {
      router.push(`/products/${slug}`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Поиск товаров
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите название товара..."
                className="w-full pl-10 pr-12 py-3 sm:py-4 text-sm sm:text-base border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="mt-3 sm:mt-4 w-full sm:w-auto bg-[#ff6900] hover:bg-[#e55a00] text-white"
            >
              {isSearching ? "Поиск..." : "Найти"}
            </Button>
          </form>
        </div>

        {/* Filters Toggle - только на мобильных */}
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full justify-start"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="lg:hidden mb-6 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Фильтры</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {/* Здесь можно добавить фильтры */}
            <p className="text-sm text-gray-500">Фильтры будут добавлены позже</p>
          </div>
        )}

        {/* Results */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Результаты поиска
                {products.length > 0 && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({products.length} товаров)
                  </span>
                )}
              </h2>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-square mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="w-16 h-16 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ошибка поиска
                </h3>
                <p className="text-gray-500">
                  Произошла ошибка при поиске товаров. Попробуйте еще раз.
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Search className="w-16 h-16 mx-auto text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Товары не найдены
                </h3>
                <p className="text-gray-500 mb-6">
                  По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  className="text-[#ff6900] border-[#ff6900] hover:bg-[#ff6900] hover:text-white"
                >
                  Очистить поиск
                </Button>
              </div>
            )}

            {/* Results */}
            {!isLoading && !error && products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.sku} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchQuery && (
          <div className="text-center py-12">
            <div className="mb-4">
              <Search className="w-16 h-16 mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Начните поиск
            </h3>
            <p className="text-gray-500">
              Введите название товара в поле поиска выше
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
