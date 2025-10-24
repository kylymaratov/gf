"use client";

import { useRef } from "react";
import { Header } from "@/components/layout/header";
import { FloatingCategoriesButton } from "@/components/ui/floating-categories-button";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { usePWA } from "@/hooks/use-pwa";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const categoriesRef = useRef<{ expand: () => void }>(null);

  // Initialize PWA
  usePWA();

  const handleCategoriesClick = () => {
    categoriesRef.current?.expand();
  };

  return (
    <>
      <Header onCategoriesClick={handleCategoriesClick} />
      <main className="pb-16 lg:pb-0">
        {children}
      </main>
      <FloatingCategoriesButton 
        ref={categoriesRef}
        onHeaderCategoriesClick={handleCategoriesClick}
      />
      <BottomNavigation />
      <ScrollToTop />
      <PWAInstallPrompt />
    </>
  );
}
