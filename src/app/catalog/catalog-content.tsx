"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useProducts } from "@/hooks/use-products";
import { ArrowLeft, Filter, Grid, List } from "lucide-react";
import { transitions } from "@/lib/view-transitions";
import { ProductListItem } from "@/components/ui/product-list-item";

interface CatalogPageContentProps {
  initialProducts: any;
  initialError: string | null;
  searchParams: {
    sort?: string;
    page?: string;
    limit?: string;
  };
}

export function CatalogPageContent({ 
  initialProducts, 
  initialError, 
  searchParams 
}: CatalogPageContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  // Состояние фильтров
  const [sortBy, setSortBy] = useState(searchParams.sort || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'));
  const [showCount, setShowCount] = useState(parseInt(searchParams.limit || '20'));
  const [showFilters, setShowFilters] = useState(false);

  // Используем клиентский хук для обновлений, но с начальными данными
  const { data: productsResponse, isLoading, error } = useProducts({
    page: currentPage,
    limit: showCount,
    sort: sortBy as 'newest' | 'popular',
    withImage: true,
  });

  // Используем данные из хука или начальные данные
  const products = productsResponse?.products || initialProducts?.products || [];
  const totalPages = productsResponse?.totalPages || initialProducts?.totalPages || 1;
  const totalProducts = productsResponse?.totalProducts || initialProducts?.totalProducts || 0;
  const hasError = error || initialError;

  const updateUrl = (newSort: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', newSort);
    window.history.replaceState({}, '', url.toString());
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateUrl(newSort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowCountChange = (count: number) => {
    setShowCount(count);
    setCurrentPage(1);
  };

  const handleBackClick = () => {
    transitions.slide(() => {
      router.back();
    });
  };

  const getSortTitle = () => {
    switch (sortBy) {
      case 'newest': return 'Новые поступления';
      case 'popular': return 'Популярные товары';
      default: return 'Новые поступления';
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="mb-8 text-4xl font-bold">Каталог товаров</h1>
            <p className="text-center text-muted-foreground mb-4">
              Ошибка загрузки товаров. Попробуйте обновить страницу.
            </p>
            <Button onClick={() => window.location.reload()}>
              Повторить
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Каталог товаров
              </h1>
              <p className="text-gray-600 mt-1">
                {totalProducts} товаров
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium text-gray-700">Сортировка:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('newest')}
                  className="text-sm"
                >
                  Новые
                </Button>
                <Button
                  variant={sortBy === 'popular' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSortChange('popular')}
                  className="text-sm"
                >
                  Популярные
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium text-gray-700">Показать:</span>
              <select
                value={showCount}
                onChange={(e) => handleShowCountChange(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900]"
              >
                <option value={12}>12</option>
                <option value={20}>20</option>
                <option value={24}>24</option>
                <option value={32}>32</option>
              </select>
              
              {/* View Mode Toggle - только на десктопе */}
              <div className="hidden lg:flex items-center gap-1 border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Показано: {getSortTitle()}
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Grid View */}
            <div className={`${viewMode === 'grid' ? 'block' : 'hidden'} grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-8`}>
              {products.map((product: any, index: number) => (
                <ProductCard key={`${product.sku}-${index}`} product={product} />
              ))}
            </div>

            {/* List View */}
            <div className={`${viewMode === 'list' ? 'lg:block' : 'hidden'} space-y-4 mb-8`}>
              {products.map((product: any, index: number) => (
                <div key={`${product.sku}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 flex-shrink-0">
                      {product.images?.[0]?.id ? (
                        <img
                          src={`/api/storage/products/images/${product.images[0].id}`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
                                  <div class="text-center">
                                    <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    <p class="text-xs">Нет изображения</p>
                                  </div>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg text-gray-400">
                          <div className="text-center">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                            <p className="text-xs">Нет изображения</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-[#ff6900]">
                          {product.price} с
                        </div>
                        <Button className="bg-[#ff6900] hover:bg-[#e55a00] text-white">
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalProducts}
              itemsPerPage={showCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
