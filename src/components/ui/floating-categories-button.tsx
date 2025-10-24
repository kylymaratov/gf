"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useCategories } from "@/hooks/use-categories";
import { categoriesService } from "@/services/categories";

interface FloatingCategoriesButtonProps {
  onHeaderCategoriesClick?: () => void;
}

export const FloatingCategoriesButton = forwardRef<
  { expand: () => void },
  FloatingCategoriesButtonProps
>(({ onHeaderCategoriesClick }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const { data: categories, isLoading } = useCategories();

      const handleExpand = () => {
        setIsExpanded(true);
        setIsClosing(false);
        setIsOpening(true);
        // Сбрасываем состояние открытия после анимации
        setTimeout(() => {
          setIsOpening(false);
        }, 50); // Задержка для запуска анимации
      };

      const handleClose = () => {
        if (isClosing) return; // Предотвращаем множественные вызовы
        setIsClosing(true);
        setIsOpening(false);
        // Ждем окончания анимации перед полным закрытием
        setTimeout(() => {
          setIsExpanded(false);
          setIsClosing(false);
        }, 300); // 300ms - время анимации
      };

  useImperativeHandle(ref, () => ({
    expand: handleExpand,
  }));

  return (
    <>
      {/* Overlay */}
      {(isExpanded || isClosing) && (
        <div 
          className={`fixed inset-0 bg-black/50 z-[59] transition-opacity duration-300 ${
            isClosing ? 'opacity-0' : isOpening ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        />
      )}
      
      {/* Menu */}
      {(isExpanded || isClosing) && (
        <div 
          className={`fixed z-[60] bg-white border-r border-gray-200 shadow-lg flex-col transition-transform duration-300 ease-in-out rounded-lg ${
            isClosing ? '-translate-x-full' : isOpening ? '-translate-x-full' : 'translate-x-0'
          }`}
          style={{ 
            width: '280px', 
            height: 'calc(100vh - 40px)', 
            top: '20px',
            left: '10px',
            maxWidth: 'calc(100vw - 20px)'
          }}
        >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="relative flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            </div>
            <span className="text-gray-800 font-bold text-base sm:text-lg">Категории</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Кнопка "Все категории" */}
        <Link
          href="/categories"
          className="flex items-center gap-2 px-3 py-2 bg-[#ff6900]/10 hover:bg-[#ff6900]/20 transition-colors rounded-lg group"
          onClick={handleClose}
        >
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <svg className="h-4 w-4 text-[#ff6900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
          <span className="text-sm font-medium text-[#ff6900] group-hover:text-[#e55a00]">
            Все категории
          </span>
          <div className="ml-auto">
            <svg className="h-4 w-4 text-[#ff6900] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </Link>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-2 sm:px-3 py-2">
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3 py-2 px-2">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-200 rounded"></div>
                  {isExpanded && <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-2 sm:px-3 py-2">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="flex items-center gap-2 sm:gap-3 px-2 py-2 hover:bg-[#ff6900]/10 transition-colors group rounded"
                onClick={handleClose}
              >
                <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                  <img
                    src={categoriesService.getCategoryImageUrl(category.slug, { iconType: 'small' })}
                    alt={category.name}
                    className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="h-6 w-6 text-gray-500 group-hover:text-[#ff6900] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                      }
                    }}
                  />
                </div>
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">
                        {category.name}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2 flex-shrink-0">
                        {category._count.products}
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
        </div>
      )}
    </>
  );
});

FloatingCategoriesButton.displayName = "FloatingCategoriesButton";
