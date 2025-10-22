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
  const { data: categories, isLoading } = useCategories();

      const handleExpand = () => {
        setIsExpanded(true);
      };

      const handleClose = () => {
        setIsExpanded(false);
      };

  useImperativeHandle(ref, () => ({
    expand: handleExpand,
  }));

  return (
    <>
      {/* Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/50 z-[59] transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
      
      {/* Menu */}
      <div 
        className={`fixed z-[60] bg-white border-r border-gray-200 shadow-lg flex-col transition-transform duration-300 ease-in-out rounded-lg ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          width: '280px', 
          height: 'calc(100vh - 40px)', 
          top: '20px',
          left: isExpanded ? '10px' : '-280px'
        }}
      >
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Menu className="h-5 w-5 text-gray-600" />
          </div>
          <span className="text-gray-800 font-bold text-lg">Категории</span>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="px-2 py-2">
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-2">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  {isExpanded && <div className="h-4 bg-gray-200 rounded w-20"></div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-2 py-2">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="flex items-center gap-3 px-2 py-2 hover:bg-[#ff6900]/10 transition-colors group rounded"
                onClick={handleClose}
              >
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                  <img
                    src={categoriesService.getCategoryImageUrl(category.slug, { iconType: 'small' })}
                    alt={category.name}
                    className="h-6 w-6 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                      }
                    }}
                  />
                </div>
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900 truncate">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
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
    </>
  );
});

FloatingCategoriesButton.displayName = "FloatingCategoriesButton";
