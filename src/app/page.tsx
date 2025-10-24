import { Suspense } from "react";
import { Metadata } from "next";
import { getBannersSSR } from "@/lib/server-actions";
import { HomePageContent } from "./home-content";

export const metadata: Metadata = {
  title: "GeneralHub - Интернет-магазин качественных товаров",
  description: "GeneralHub - современный интернет-магазин с широким ассортиментом качественных товаров по доступным ценам. Быстрая доставка, гарантия качества, удобная оплата.",
  keywords: "интернет-магазин, товары, доставка, качество, GeneralHub",
  openGraph: {
    title: "GeneralHub - Интернет-магазин качественных товаров",
    description: "Современный интернет-магазин с широким ассортиментом качественных товаров по доступным ценам",
    type: "website",
    locale: "ru_RU",
  },
};

export default async function HomePage() {
  // Получаем баннеры на сервере
  const { banners, error } = await getBannersSSR();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6900] mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    }>
      <HomePageContent 
        initialBanners={banners} 
        initialError={error}
      />
    </Suspense>
  );
}