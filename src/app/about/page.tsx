import Link from "next/link";
import { Metadata } from "next";
import { Home } from "lucide-react";

export const metadata: Metadata = {
  title: "О нас - GeneralHub",
  description: "Узнайте больше о GeneralHub - современном интернет-магазине с широким ассортиментом качественных товаров по доступным ценам.",
  keywords: "о нас, GeneralHub, интернет-магазин, качество, доставка",
  openGraph: {
    title: "О нас - GeneralHub",
    description: "Узнайте больше о GeneralHub - современном интернет-магазине",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 sm:py-12 lg:py-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-[#ff6900] transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900">О нас</span>
        </div>

        <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">О нас</h1>

        <div className="prose prose-neutral max-w-none">
          <p className="lead text-lg sm:text-xl text-muted-foreground">
            GeneralHub - это современный интернет-магазин, предлагающий широкий
            ассортимент качественных товаров по доступным ценам.
          </p>

          <h2 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold">Наша миссия</h2>
          <p>
            Мы стремимся предоставить нашим клиентам лучший опыт онлайн-покупок,
            сочетая широкий выбор товаров, конкурентные цены и отличное
            обслуживание клиентов.
          </p>

          <h2 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold">Почему выбирают нас?</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Широкий ассортимент качественных товаров</li>
            <li>Конкурентные цены</li>
            <li>Быстрая доставка по всей России</li>
            <li>Гарантия качества на все товары</li>
            <li>Профессиональная поддержка клиентов</li>
            <li>Удобные способы оплаты</li>
          </ul>

          <h2 className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold">Свяжитесь с нами</h2>
          <p>
            У вас есть вопросы или предложения? Мы всегда рады услышать наших
            клиентов.
          </p>
          <p>
            Email: info@generalhub.com
            <br />
            Телефон: +7 (800) 123-45-67
          </p>
        </div>
      </div>
    </div>
  );
}

