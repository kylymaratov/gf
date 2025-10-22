import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCategoriesButton } from "@/components/ui/floating-categories-button";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GeneralHub - Интернет-магазин",
  description: "Качественные товары по доступным ценам",
  keywords: ["интернет-магазин", "товары", "покупки", "онлайн"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
