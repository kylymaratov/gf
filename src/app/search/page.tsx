import { Suspense } from "react";
import { Metadata } from "next";
import { SearchPageContent } from "./search-content";

export const metadata: Metadata = {
  title: "Поиск товаров - GeneralHub",
  description: "Найдите нужные товары в нашем интернет-магазине. Быстрый и удобный поиск по каталогу.",
  keywords: "поиск товаров, каталог, интернет-магазин, GeneralHub",
  openGraph: {
    title: "Поиск товаров - GeneralHub",
    description: "Найдите нужные товары в нашем интернет-магазине",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6900] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
