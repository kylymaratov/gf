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

  const handleBannerClick = (banner: Banner) => {
    if (banner.openUrl) {
      window.open(banner.openUrl, '_blank');
    }
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
            <BannerSlide key={banner.id} banner={banner} />
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
  
  // Отладочная информация
  console.log('BannerSlide render:', {
    id: banner.id,
    title: banner.title,
    description: banner.description,
    buttonTitle: banner.buttonTitle,
    hasContent,
    imageLoaded,
    imageError,
    imageUrl: bannersService.getBannerImageUrl(banner.id)
  });
  
  // Используем позицию из API с fallback на 'left'
  const position = banner.contentPosition || 'left';
  
  const gradientClasses = {
    left: 'bg-gradient-to-r from-black/70 via-black/50 via-black/30 to-transparent',
    center: 'bg-gradient-to-r from-transparent via-black/40 via-black/30 to-transparent',
    right: 'bg-gradient-to-r from-transparent via-black/30 via-black/50 to-black/70',
  };
  
  return (
    <div className="w-full flex-shrink-0 relative min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-gray-100 overflow-hidden"
        style={{
          backgroundImage: imageLoaded && !imageError ? `url(${bannersService.getBannerImageUrl(banner.id)})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out'
        }}
      >
        {/* Скрытое изображение для отслеживания загрузки */}
        {!imageError && (
          <img
            src={bannersService.getBannerImageUrl(banner.id)}
            alt=""
            className="hidden"
            onLoad={() => {
              setImageLoaded(true);
              console.log('✅ Banner image loaded successfully:', {
                bannerId: banner.id,
                imageUrl: bannersService.getBannerImageUrl(banner.id)
              });
            }}
            onError={() => {
              console.error('❌ Failed to load banner image:', {
                bannerId: banner.id,
                imageUrl: bannersService.getBannerImageUrl(banner.id)
              });
              setImageError(true);
            }}
          />
        )}
        
        {/* Временный fallback для тестирования */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Загрузка изображения...</p>
              <p className="text-xs mt-1 opacity-75">ID: {banner.id}</p>
            </div>
          </div>
        )}
        
        {/* Fallback для ошибок */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-sm">Изображение недоступно</p>
              <p className="text-xs mt-1 opacity-75">ID: {banner.id}</p>
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
        <div className="relative h-full flex items-center z-30">
          <div className={`w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-24 ${
            position === 'center' ? 'container mx-auto' : ''
          }`}>
            <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl space-y-2 sm:space-y-3 ${
              position === 'right' ? 'ml-auto text-right' : 
              position === 'center' ? 'mx-auto text-center' : 
              'text-left'
            }`}>
              {/* Decorative line */}
              <div className={`w-8 sm:w-10 h-0.5 bg-gradient-to-r from-[#ff6900] to-[#ff8533] rounded-full ${
                position === 'center' ? 'mx-auto' : 
                position === 'right' ? 'ml-auto' : 
                ''
              }`}></div>
              
              {/* Title - показываем только если есть */}
              {banner.title?.trim() && (
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight drop-shadow-2xl">
                  {banner.title}
                </h2>
              )}
              
              {/* Description - показываем только если есть */}
              {banner.description?.trim() && (
                <p className={`text-xs sm:text-sm md:text-sm lg:text-base text-white/95 leading-relaxed drop-shadow-lg max-w-sm sm:max-w-md md:max-w-lg ${
                  position === 'center' ? 'mx-auto' : 
                  position === 'right' ? 'ml-auto' : 
                  ''
                }`}>
                  {banner.description}
                </p>
              )}

              {/* Button - показываем только если есть кнопка или URL */}
              {(banner.buttonTitle?.trim() || banner.openUrl) && (
                <div className={`pt-2 sm:pt-3 ${
                  position === 'center' ? 'flex justify-center' : 
                  position === 'right' ? 'flex justify-end' : 
                  ''
                }`}>
                  <button
                    className="bg-gradient-to-r from-[#ff6900] to-[#ff8533] hover:from-[#e55a00] hover:to-[#e66a00] text-white font-semibold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-sm rounded-lg shadow-xl hover:shadow-[#ff6900]/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 inline-flex items-center gap-1.5 sm:gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Banner button clicked:', { buttonTitle: banner.buttonTitle, openUrl: banner.openUrl });
                      if (banner.openUrl) {
                        window.open(banner.openUrl, '_blank');
                      }
                    }}
                  >
                    {banner.buttonTitle || 'Узнать больше'}
                    <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
