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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === banners.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return banners.length - 1;
      }
      return prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentSlide((prev) => {
      if (prev === banners.length - 1) {
        return 0;
      }
      return prev + 1;
    });
  };


  // Touch event handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && banners.length > 1) {
      goToNext();
    }
    if (isRightSwipe && banners.length > 1) {
      goToPrevious();
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
    <div className="relative w-full">
      {/* Navigation Arrows - вне контейнера, показываем только если больше 1 баннера */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-16 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-600 border border-gray-200 h-12 w-12 rounded-full transition-all duration-300 hover:scale-110 z-10 hidden lg:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-16 top-1/2 -translate-y-1/2 bg-white shadow-lg hover:bg-gray-50 text-gray-600 border border-gray-200 h-12 w-12 rounded-full transition-all duration-300 hover:scale-110 z-10 hidden lg:flex"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slider Container */}
      <div 
        className="relative w-full overflow-hidden rounded-lg group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${banners.length * 100}%`
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full flex-shrink-0">
              <BannerSlide banner={banner} />
            </div>
          ))}
        </div>

        {/* Mobile Navigation Arrows - скрыты, используем только свайпы */}
        {banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 hidden"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 hidden"
              onClick={goToNext}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </Button>
          </>
        )}

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
      </div>
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
    left: 'bg-gradient-to-r from-black/70 via-black/50 via-black/30 to-transparent',
    center: 'bg-gradient-to-r from-transparent via-black/40 via-black/30 to-transparent',
    right: 'bg-gradient-to-r from-transparent via-black/30 via-black/50 to-black/70',
  };
  
  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      {/* Background Image via <img> */}
      <div className="absolute inset-0 bg-gray-100 z-0">
        {!imageError && (
          <img
            src={bannersService.getBannerImageUrl(banner.id)}
            alt={banner.title || ''}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Loading state */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6900] mx-auto mb-2"></div>
              <p className="text-sm">Загрузка...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Изображение недоступно</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Градиент поверх изображения */}
      {hasContent && imageLoaded && !imageError && (
        <div className={`absolute inset-0 ${gradientClasses[position]} z-10`} />
      )}
      

      {/* Content - показываем если есть контент */}
      {hasContent && (
        <div className="absolute inset-0 flex items-center z-30 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className={`w-full ${
            position === 'center' ? 'text-center' : 
            position === 'right' ? 'text-right' : 
            'text-left'
          }`}>
            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-3 sm:space-y-4 ${
              position === 'right' ? 'ml-auto' : 
              position === 'center' ? 'mx-auto' : 
              ''
            }`}>
              {/* Decorative line */}
              <div className={`w-8 sm:w-10 h-0.5 bg-gradient-to-r from-[#ff6900] to-[#ff8533] rounded-full ${
                position === 'center' ? 'mx-auto' : 
                position === 'right' ? 'ml-auto' : 
                ''
              }`}></div>
              
              {/* Title */}
              {banner.title?.trim() && (
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight drop-shadow-2xl">
                  {banner.title}
                </h2>
              )}
              
              {/* Description */}
              {banner.description?.trim() && (
                <p className="text-sm sm:text-base md:text-lg text-white/95 leading-relaxed drop-shadow-lg">
                  {banner.description}
                </p>
              )}

              {/* Button */}
              {(banner.buttonTitle?.trim() || banner.openUrl) && (
                <div className={`pt-2 ${
                  position === 'center' ? 'flex justify-center' : 
                  position === 'right' ? 'flex justify-end' : 
                  ''
                }`}>
                  <button
                    className="bg-gradient-to-r from-[#ff6900] to-[#ff8533] hover:from-[#e55a00] hover:to-[#e66a00] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-xl hover:shadow-[#ff6900]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 inline-flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (banner.openUrl) {
                        window.open(banner.openUrl, '_blank');
                      }
                    }}
                  >
                    {banner.buttonTitle || 'Узнать больше'}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Decorative elements */}
      {imageLoaded && !imageError && hasContent && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-[#ff6900]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}
    </div>
  );
}
