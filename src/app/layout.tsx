import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCategoriesButton } from "@/components/ui/floating-categories-button";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GF Store - Интернет-магазин",
  description: "Современный интернет-магазин с широким ассортиментом товаров",
  keywords: ["интернет-магазин", "товары", "покупки", "онлайн"],
  manifest: "/manifest.json",
  themeColor: "#ff6900",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GF Store",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="view-transition" content="same-origin" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff6900" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GF Store" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <ClientLayout>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ToastProvider />
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
