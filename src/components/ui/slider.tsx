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
        {banners.map((banner) => (
          <BannerSlide key={banner.id} banner={banner} />
        ))}
      </div>

      {/* Navigation Arrows - показываем только если больше 1 баннера */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
            onClick={goToNext}
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </Button>

          {/* Dots Navigation */}
          <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-1 sm:space-x-2 bg-black/30 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-full">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide 
                    ? 'w-6 h-2 sm:w-8 sm:h-3 bg-[#ff6900] shadow-lg' 
                    : 'w-2 h-2 sm:w-3 sm:h-3 bg-white/60 hover:bg-white/80 hover:scale-110'
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

// Отдельный компонент для слайда баннера
function BannerSlide({ banner }: { banner: Banner }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Проверяем, есть ли текст для отображения
  const hasContent = banner.title?.trim() || banner.description?.trim() || banner.buttonTitle?.trim();
  
  // Используем позицию из API с fallback на 'left'
  const position = banner.contentPosition || 'left';
  
  const gradientClasses = {
    left: 'bg-gradient-to-r from-black/80 via-black/50 to-transparent',
    center: 'bg-gradient-to-r from-transparent via-black/70 to-transparent',
    right: 'bg-gradient-to-r from-transparent via-black/50 to-black/80',
  };
  
  return (
    <div className="w-full flex-shrink-0 relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <img
          src={bannersService.getBannerImageUrl(banner.id)}
          alt={banner.title || 'Баннер'}
          className="w-full h-full object-cover opacity-0 transition-opacity duration-700"
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.opacity = '1';
            setImageLoaded(true);
          }}
          onError={(e) => {
            console.error('Failed to load banner image:', bannersService.getBannerImageUrl(banner.id));
            setImageError(true);
          }}
        />
        
        {/* Показываем градиенты и контент только если изображение загрузилось успешно */}
        {imageLoaded && !imageError && (
          <>
            {/* Enhanced Gradient Overlay - показываем только если есть контент */}
            {hasContent && (
              <>
                <div className={`absolute inset-0 ${gradientClasses[position]}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </>
            )}
          </>
        )}
      </div>

      {/* Content - показываем только если изображение загрузилось успешно и есть контент */}
      {imageLoaded && !imageError && hasContent && (
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 w-full">
            <div className={`max-w-lg sm:max-w-xl lg:max-w-2xl space-y-3 sm:space-y-4 ${position === 'right' ? 'ml-auto text-right' : position === 'center' ? 'mx-auto text-center' : 'text-left'}`}>
              {/* Decorative line */}
              <div className={`w-8 sm:w-10 h-0.5 bg-gradient-to-r from-[#ff6900] to-[#ff8533] rounded-full ${position === 'center' ? 'mx-auto' : ''}`}></div>
              
              {/* Title - показываем только если есть */}
              {banner.title?.trim() && (
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight drop-shadow-2xl">
                  {banner.title}
                </h2>
              )}
              
              {/* Description - показываем только если есть */}
              {banner.description?.trim() && (
                <p className={`text-sm sm:text-sm md:text-base lg:text-lg text-white/95 leading-relaxed drop-shadow-lg max-w-lg ${position === 'center' ? 'mx-auto' : ''}`}>
                  {banner.description}
                </p>
              )}

              {/* Button - показываем только если есть кнопка или URL */}
              {(banner.buttonTitle?.trim() || banner.openUrl) && (
                <div className={`pt-2 sm:pt-3 ${position === 'center' ? 'flex justify-center' : ''}`}>
                  <button
                    className="bg-gradient-to-r from-[#ff6900] to-[#ff8533] hover:from-[#e55a00] hover:to-[#e66a00] text-white font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-sm sm:text-sm md:text-base rounded-xl shadow-xl hover:shadow-[#ff6900]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 inline-flex items-center gap-2 sm:gap-2.5"
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
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative elements - показываем только если изображение загрузилось и есть контент */}
      {imageLoaded && !imageError && hasContent && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#ff6900]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-r from-[#ff6900]/5 to-[#ff8533]/5 rounded-full blur-2xl pointer-events-none"></div>
        </>
      )}
    </div>
  );
}
