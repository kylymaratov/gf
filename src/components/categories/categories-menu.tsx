"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Package } from "lucide-react";
import { Sheet, SheetContent, SheetOverlay } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { categoriesService } from "@/services/categories";

interface CategoriesMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoriesMenu({ open, onOpenChange }: CategoriesMenuProps) {
  const { data: categories, isLoading, error } = useCategories();

  const handleCategoryClick = (categorySlug: string) => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetOverlay onClick={() => onOpenChange(false)} />
      <SheetContent>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">КАТЕГОРИИ</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Загрузка категорий...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Ошибка загрузки категорий</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {categories?.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={categoriesService.getCategoryImageUrl(category.slug, { iconType: 'small' })}
                          alt={category.name}
                          className="h-5 w-5 object-contain"
                          onError={(e) => {
                            // Fallback иконка если изображение не загрузилось
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<svg class="h-5 w-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                          {category.name}
                        </span>
                        {category._count.products > 0 && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({category._count.products})
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
