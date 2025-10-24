import { Suspense } from "react";
import { Metadata } from "next";
import { getProductsSSR } from "@/lib/server-actions";
import { CatalogPageContent } from "./catalog-content";

export const metadata: Metadata = {
  title: "Каталог товаров - GeneralHub",
  description: "Каталог всех товаров в нашем интернет-магазине. Новые поступления, популярные товары, удобная сортировка и фильтрация.",
  keywords: "каталог товаров, новые товары, популярные товары, интернет-магазин, GeneralHub",
  openGraph: {
    title: "Каталог товаров - GeneralHub",
    description: "Каталог всех товаров в нашем интернет-магазине",
    type: "website",
  },
};

interface CatalogPageProps {
  searchParams: Promise<{
    sort?: string;
    page?: string;
    limit?: string;
    discount?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  // Await searchParams
  const params = await searchParams;
  
  // Получаем начальные данные на сервере
  const { products, error } = await getProductsSSR({
    page: parseInt(params.page || '1'),
    limit: parseInt(params.limit || '20'),
    sort: params.sort || 'newest',
    withImage: true,
    discountPrecent: params.discount ? parseInt(params.discount) : undefined,
  });

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6900] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка каталога...</p>
        </div>
      </div>
    }>
      <CatalogPageContent 
        initialProducts={products} 
        initialError={error}
        searchParams={params}
      />
    </Suspense>
  );
}