"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { categoriesService } from "@/services/categories";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 px-4">
          <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4 mx-auto"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="mb-8 text-4xl font-bold">Категории</h1>
            <p className="text-center text-muted-foreground mb-4">
              Ошибка загрузки категорий. Попробуйте обновить страницу.
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
      <div className="container mx-auto py-12 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900">Категории</span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Все категории</h1>
          <p className="text-gray-600 text-lg">Выберите категорию для просмотра товаров</p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-transparent hover:border-[#ff6900] hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Category Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-[#ff6900]/10 group-hover:scale-110 transition-all duration-300">
                    <img
                      src={categoriesService.getCategoryImageUrl(category.slug, { iconType: 'small' })}
                      alt={category.name}
                      className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#ff6900] transition-colors mb-2 line-clamp-2">
                    {category.name}
                  </h3>
                  
                  {/* Product Count */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 group-hover:bg-[#ff6900]/10 transition-colors">
                    <span className="text-sm text-gray-600 group-hover:text-[#ff6900] transition-colors font-medium">
                      {category._count.products} товаров
                    </span>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#ff6900]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

