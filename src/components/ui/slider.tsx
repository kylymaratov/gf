"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Banner, bannersService } from "@/services/banners";

interface SliderProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function Slider({ banners, autoPlay = true, autoPlayInterval = 5000 }: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = (banner: Banner) => {
    if (banner.openUrl) {
      window.open(banner.openUrl, '_blank');
    }
  };

  if (banners.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Нет доступных баннеров</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg group">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => {
          // Используем позицию из API с fallback на 'left'
          const position = banner.contentPosition || 'left';
          
          const gradientClasses = {
            left: 'bg-gradient-to-r from-black/70 via-black/40 to-transparent',
            center: 'bg-gradient-to-r from-transparent via-black/60 to-transparent',
            right: 'bg-gradient-to-r from-transparent via-black/40 to-black/70',
          };
          
          return (
          <div
            key={banner.id}
            className="w-full flex-shrink-0 relative min-h-[400px] md:min-h-[500px]"
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <img
                src={bannersService.getBannerImageUrl(banner.id)}
                alt={banner.title}
                className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.opacity = '1';
                }}
                onError={(e) => {
                  // Fallback если изображение не загрузилось
                  const target = e.target as HTMLImageElement;
                  const imageUrl = bannersService.getBannerImageUrl(banner.id);
                  console.error('Failed to load banner image:', imageUrl);
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = 'linear-gradient(135deg, #ff6900 0%, #e55a00 100%)';
                    parent.innerHTML += `
                      <div class="flex items-center justify-center h-full">
                        <div class="text-center text-white px-4">
                          <svg class="w-20 h-20 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <h3 class="text-2xl md:text-3xl font-bold mb-2">Изображение недоступно</h3>
                          <p class="text-white/80 text-xs">ID: ${banner.id}</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
              {/* Enhanced Gradient Overlay - адаптируется к позиции контента */}
              <div className={`absolute inset-0 ${gradientClasses[position]}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 md:px-20 lg:px-24 w-full">
                <div className={`max-w-xl space-y-2 md:space-y-3 ${position === 'right' ? 'ml-auto text-right' : position === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
                  {/* Decorative line */}
                  <div className={`w-10 h-0.5 bg-[#ff6900] rounded-full ${position === 'center' ? 'mx-auto' : ''}`}></div>
                  
                  {/* Title */}
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-2xl">
                    {banner.title}
                  </h2>
                  
                  {/* Description */}
                  <p className={`text-xs md:text-sm lg:text-base text-white/90 leading-relaxed drop-shadow-lg max-w-lg ${position === 'center' ? 'mx-auto' : ''}`}>
                    {banner.description}
                  </p>

                  {/* Button - всегда показываем если есть хотя бы один из параметров */}
                  <div className={`pt-1 md:pt-2 ${position === 'center' ? 'flex justify-center' : ''}`}>
                    <button
                      className="bg-[#ff6900] hover:bg-[#e55a00] text-white font-medium px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm rounded-lg shadow-xl hover:shadow-[#ff6900]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 inline-flex items-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Banner button clicked:', { buttonTitle: banner.buttonTitle, openUrl: banner.openUrl });
                        if (banner.openUrl) {
                          window.open(banner.openUrl, '_blank');
                        }
                      }}
                    >
                      {banner.buttonTitle || 'Узнать больше'}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6900]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
          );
        })}
      </div>

      {/* Navigation Arrows - показываем только если больше 1 баннера */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-9 w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-9 w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? 'w-8 h-3 bg-[#ff6900] shadow-lg' 
                    : 'w-3 h-3 bg-white/60 hover:bg-white/80 hover:scale-110'
                }`}
                onClick={() => goToSlide(index)}
                title={`Слайд ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
