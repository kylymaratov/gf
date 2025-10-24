import Link from "next/link";
import { Metadata } from "next";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/ui/category-icon";
import { getCategoriesSSR } from "@/lib/server-actions";

export const metadata: Metadata = {
  title: "Категории товаров - GeneralHub",
  description: "Просмотрите все категории товаров в нашем интернет-магазине. Широкий ассортимент качественных товаров по доступным ценам.",
  keywords: "категории товаров, каталог, интернет-магазин, GeneralHub",
  openGraph: {
    title: "Категории товаров - GeneralHub",
    description: "Просмотрите все категории товаров в нашем интернет-магазине",
    type: "website",
  },
};

export default async function CategoriesPage() {
  const { categories, error } = await getCategoriesSSR();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 sm:py-8 lg:py-12 px-4">
          <div className="text-center">
            <h1 className="mb-8 text-4xl font-bold">Категории</h1>
            <p className="text-center text-muted-foreground mb-4">
              Ошибка загрузки категорий. Попробуйте обновить страницу.
            </p>
            <Button asChild>
              <Link href="/categories">Повторить</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 sm:py-8 lg:py-12 px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900">Категории</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Все категории</h1>
          <p className="text-gray-600 text-sm sm:text-sm lg:text-base">Выберите категорию для просмотра товаров</p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <div className="bg-white rounded-xl p-4 sm:p-4 lg:p-6 shadow-sm border border-transparent hover:border-[#ff6900] hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden">
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6900]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Category Icon */}
                  <div className="w-12 h-12 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-3 lg:mb-4 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-[#ff6900]/10 group-hover:scale-110 transition-all duration-300">
                    <CategoryIcon
                      slug={category.slug}
                      name={category.name}
                      className="w-8 h-8 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      iconType="small"
                    />
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-sm sm:text-sm lg:text-base font-semibold text-gray-900 group-hover:text-[#ff6900] transition-colors mb-2 line-clamp-2">
                    {category.name}
                  </h3>
                  
                  {/* Product Count */}
                  <div className="inline-flex items-center px-2 sm:px-2 lg:px-3 py-1 rounded-full bg-gray-100 group-hover:bg-[#ff6900]/10 transition-colors">
                    <span className="text-xs sm:text-xs lg:text-sm text-gray-600 group-hover:text-[#ff6900] transition-colors font-medium">
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

