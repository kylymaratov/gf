"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Показываем кнопку когда пользователь прокрутил вниз на 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Слушаем событие прокрутки
    window.addEventListener("scroll", toggleVisibility);

    // Очищаем слушатель при размонтировании
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-[#ff6900] hover:bg-[#e55a00] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 p-0 ${
            isVisible ? 'animate-in fade-in slide-in-from-bottom-4' : ''
          }`}
          aria-label="Прокрутить вверх"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}

