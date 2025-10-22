"use client";

import { useRef } from "react";
import { Header } from "@/components/layout/header";
import { FloatingCategoriesButton } from "@/components/ui/floating-categories-button";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const categoriesRef = useRef<{ expand: () => void }>(null);

  const handleCategoriesClick = () => {
    categoriesRef.current?.expand();
  };

  return (
    <>
      <Header onCategoriesClick={handleCategoriesClick} />
      {children}
      <FloatingCategoriesButton 
        ref={categoriesRef}
        onHeaderCategoriesClick={handleCategoriesClick}
      />
      <ScrollToTop />
      <ThemeToggle />
    </>
  );
}
