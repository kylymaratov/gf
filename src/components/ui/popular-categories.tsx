"use client";

import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/use-categories";
import { categoriesService } from "@/services/categories";
import { transitions } from "@/lib/view-transitions";
import { Grid3X3, ArrowRight } from "lucide-react";
import { Button } from "./button";

export function PopularCategories() {
  const { data: categories, isLoading, error } = useCategories({ sort: 'popular' });
  const router = useRouter();

  const handleCategoryClick = (slug: string) => {
    transitions.slide(() => {
      router.push(`/categories/${slug}`);
    });
  };

  const handleAllCategoriesClick = () => {
    transitions.slide(() => {
      router.push('/categories');
    });
  };

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#ff6900] to-[#ff8533] rounded-lg">
              <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Популярные категории</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col items-center justify-center animate-pulse">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  // Берем первые 6 категорий
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-[#ff6900] to-[#ff8533] rounded-lg">
            <Grid3X3 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Популярные категории</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="group bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-transparent hover:border-[#ff6900] hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden"
            >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Category Icon */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-lg sm:rounded-xl bg-gray-50 group-hover:bg-[#ff6900]/10 group-hover:scale-110 transition-all duration-300">
                    <img
                      src={categoriesService.getCategoryImageUrl(category.slug, { iconType: 'small' })}
                      alt={category.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 group-hover:text-[#ff6900] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                          `;
                        }
                      }}
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-[#ff6900] transition-colors mb-2 line-clamp-2">
                    {category.name}
                  </h3>
                  
                  {/* Product Count */}
                  <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-gray-100 group-hover:bg-[#ff6900]/10 transition-colors">
                    <span className="text-xs sm:text-sm text-gray-600 group-hover:text-[#ff6900] transition-colors font-medium">
                      {category._count.products} товаров
                    </span>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-bl from-[#ff6900]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full"></div>
              </button>
            ))}
        </div>

        {/* All Categories Button */}
        <div className="flex justify-center lg:justify-end mt-6 sm:mt-8">
          <Button
            variant="outline"
            onClick={handleAllCategoriesClick}
            className="text-xs sm:text-sm font-medium inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2"
          >
            Все категории
            <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

