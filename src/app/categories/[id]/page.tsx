"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCategory, useCategories } from "@/hooks/use-categories";
import { useProducts } from "@/hooks/use-products";
import { categoriesService } from "@/services/categories";
import { productsService } from "@/services/products";
import { ProductCard } from "@/components/ui/product-card";
import { ProductListItem } from "@/components/ui/product-list-item";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { transitions } from "@/lib/view-transitions";
import { ChevronDown, Grid, List, Heart, ShoppingCart, Home } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: category, isLoading: categoryLoading, error: categoryError } = useCategory(id);
  const { data: allCategories, isLoading: categoriesLoading } = useCategories();
  const [sortBy, setSortBy] = useState("default");
  const [showCount, setShowCount] = useState(16);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products for this category
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({
    categorySlug: id,
    limit: showCount,
    page: currentPage,
    sort: sortBy === "default" ? undefined : sortBy,
  });

  const handleCategoryClick = (slug: string) => {
    if (slug !== id) {
      transitions.slide(() => {
        router.push(`/categories/${slug}`);
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowCountChange = (count: number) => {
    setShowCount(count);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="flex gap-8">
            {/* Sidebar Skeleton */}
            <div className="w-80 bg-white rounded-lg p-6 shadow-sm">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="space-y-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-lg animate-pulse">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="w-6 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content Skeleton */}
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="mb-8 text-3xl font-bold">Категория не найдена</h1>
            <p className="text-muted-foreground mb-4">
              Категория с идентификатором "{id}" не существует.
            </p>
            <Button onClick={() => window.history.back()}>
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#ff6900] transition-colors">
            Категории
          </Link>
          <span>/</span>
          <span className="text-gray-900">{category.name}</span>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Categories */}
          <div className="w-80 bg-white rounded-lg shadow-sm sticky top-24 self-start">
            <div className="px-4 py-3 border-b">
              <h2 className="text-xl font-bold text-gray-900">Категории</h2>
            </div>
            
            <div className="p-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
              {categoriesLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 px-3 bg-gray-100 rounded-lg animate-pulse">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="w-6 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                allCategories?.map((cat) => {
                  const isActive = cat.slug === id;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg text-left transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#ff6900] text-white shadow-md' 
                          : 'hover:bg-gray-50 hover:text-[#ff6900]'
                      }`}
                    >
                      <div className={`w-5 h-5 flex items-center justify-center ${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-[#ff6900]'
                      }`}>
                        <img
                          src={categoriesService.getCategoryImageUrl(cat.slug, { iconType: 'small' })}
                          alt={cat.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                </svg>
                              `;
                            }
                          }}
                        />
                      </div>
                      
                      <span className="font-medium text-sm flex-1 truncate">
                        {cat.name}
                      </span>
                      
                      {cat._count.products > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-[#ff6900]/10 group-hover:text-[#ff6900]'
                        }`}>
                          {cat._count.products}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Сортировка:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900]"
                  >
                    <option value="default">По умолчанию</option>
                    <option value="price_asc">По возрастанию цены</option>
                    <option value="price_desc">По убыванию цены</option>
                    <option value="name">По названию</option>
                    <option value="popular">По популярности</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Показать:</span>
                  <select 
                    value={showCount}
                    onChange={(e) => handleShowCountChange(Number(e.target.value))}
                    className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900]"
                  >
                    <option value={12}>12</option>
                    <option value={16}>16</option>
                    <option value={24}>24</option>
                    <option value={32}>32</option>
                  </select>
                  
                  <div className="flex items-center gap-1 border border-gray-200 rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : productsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Ошибка загрузки товаров. Попробуйте обновить страницу.
                </p>
                <Button onClick={() => window.location.reload()}>
                  Повторить
                </Button>
              </div>
            ) : productsData?.products && productsData.products.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {productsData.products.map((product, index) => (
                      <ProductCard key={`${product.sku}-${index}`} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {productsData.products.map((product, index) => (
                      <ProductListItem key={`${product.sku}-${index}`} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {productsData.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={productsData.totalPages}
                      totalItems={productsData.totalProducts}
                      itemsPerPage={showCount}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  В данной категории пока нет товаров.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
