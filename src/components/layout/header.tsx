"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, UserCircle, Menu, Phone, MapPin, Clock, Mail, Sparkles, Facebook, Twitter, Instagram, Contact, User, ShoppingCart, Info, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { Logo } from "@/components/ui/logo";
import { transitions } from "@/lib/view-transitions";

interface HeaderProps {
  onCategoriesClick?: () => void;
}

export function Header({ onCategoriesClick }: HeaderProps) {
  const totalItems = useCartStore((state) => state.getUniqueItemsCount());
  const [isContactsDropdownOpen, setIsContactsDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavigation = (href: string, inDevelopment?: boolean) => {
    if (inDevelopment) {
      // Показываем уведомление о разработке
      alert('Эта страница находится в разработке');
      return;
    }
    
    transitions.slide(() => {
      router.push(href);
    });
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Logo />

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors"
            onClick={onCategoriesClick}
            title="Открыть меню категорий товаров"
          >
            <div className="p-1 bg-gray-200 rounded">
              <Menu className="h-4 w-4" />
            </div>
            <span className="text-gray-900">Категории</span>
          </button>
          <button 
            onClick={() => handleNavigation('/catalog')}
            className={`transition-colors hover:text-foreground/80 ${
              isActive('/catalog') ? 'text-[#ff6900] font-semibold' : ''
            }`}
            title="Каталог всех товаров"
          >
            Каталог
          </button>
              <button 
                onClick={() => handleNavigation('/delivery')}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/delivery') ? 'text-[#ff6900] font-semibold' : ''
                }`}
                title="Информация о доставке и оплате"
              >
                Доставка и оплата
              </button>
              <button 
                onClick={() => handleNavigation('/about')}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive('/about') ? 'text-[#ff6900] font-semibold' : ''
                }`}
                title="Информация о нашей компании"
              >
                О нас
              </button>
          <div 
            className="relative"
            onMouseEnter={() => {
              if (dropdownTimeout) {
                clearTimeout(dropdownTimeout);
                setDropdownTimeout(null);
              }
              setIsContactsDropdownOpen(true);
            }}
            onMouseLeave={() => {
              const timeout = setTimeout(() => {
                setIsContactsDropdownOpen(false);
              }, 200);
              setDropdownTimeout(timeout);
            }}
          >
            <button 
              onClick={() => handleNavigation('/contacts')}
              className={`transition-colors hover:text-foreground/80 flex items-center gap-1 ${
                isActive('/contacts') ? 'text-[#ff6900] font-semibold' : ''
              }`}
              title="Контактная информация и адреса"
            >
              <Contact className="h-4 w-4" />
              <span>Контакты</span>
            </button>
            
            {/* Contacts Dropdown */}
            {isContactsDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6 z-50">
                {/* Address */}
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Наш адрес</h3>
                    <p className="text-sm text-gray-600">Кыргызстан г. Бишкек ул. Киевская 168, 720001</p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Телефоны:</h3>
                    <div className="space-y-1">
                      <a href="tel:+996709891054" className="block text-sm text-red-500 underline hover:text-red-600">
                        +996709891054
                      </a>
                      <a href="tel:+996505891054" className="block text-sm text-red-500 underline hover:text-red-600">
                        +996505891054
                      </a>
                    </div>
                    <Button className="mt-2 border border-red-500 text-red-500 hover:bg-red-50 bg-white h-8 text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Перезвоните мне
                    </Button>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3 mb-4">
                  <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Время работы</h3>
                    <p className="text-sm text-gray-600">Режим работы:</p>
                    <p className="text-sm text-gray-600">Понедельник - воскресенье с 10:00 - 20:00 ч.</p>
                    <p className="text-sm text-gray-600">Без обеда</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">@ E-mail</h3>
                    <a href="mailto:info@softech.kg" className="text-sm text-red-500 underline hover:text-red-600">
                      info@softech.kg
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Мы в соцсетях</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Facebook className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Twitter className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Instagram className="h-4 w-4 text-pink-500" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Go to Contacts Button */}
                <Link href="/contacts" className="block">
                  <Button className="w-full border border-red-500 text-red-500 hover:bg-red-50 bg-white h-10">
                    Перейти в контакты
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Actions - скрываем на мобильных и планшетах, показываем только на lg+ */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex flex-col items-center -mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 relative" 
              title="Поиск товаров"
              onClick={() => handleNavigation('/search', true)}
            >
              <Search className="h-[30px] w-[30px] text-gray-400" />
              {/* Development indicator */}
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500 border border-white shadow-sm"></span>
            </Button>
            <span className="text-xs text-gray-400">Поиск</span>
          </div>
          
          <div className="flex flex-col items-center -mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 relative" 
              title="Мой профиль"
              onClick={() => handleNavigation('/profile', true)}
            >
              <UserCircle className="h-[30px] w-[30px] text-gray-400" />
              {/* Development indicator */}
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500 border border-white shadow-sm"></span>
            </Button>
            <span className="text-xs text-gray-400">Профиль</span>
          </div>

          <div className="flex flex-col items-center -mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 relative" 
              title="Корзина покупок"
              onClick={() => handleNavigation('/cart')}
            >
              <ShoppingBag className="h-[30px] w-[30px]" />
              {isClient && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff6900] text-[10px] font-bold text-white flex items-center justify-center shadow-lg border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Button>
            <span className="text-xs text-gray-600">Корзина</span>
          </div>

        </div>
      </div>
    </header>

    {/* Mobile Menu */}
    <div className={`lg:hidden bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden sticky top-16 z-40 ${
      isMobileMenuOpen 
        ? 'max-h-40 opacity-100' 
        : 'max-h-0 opacity-0'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <nav className="space-y-1">
          {/* Navigation Links - только основные пункты */}
          <button 
            onClick={() => {
              handleNavigation('/about');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base ${
              isActive('/about') ? 'bg-[#ff6900]/10 text-[#ff6900] font-semibold' : 'hover:bg-gray-50'
            }`}
          >
            <Info className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>О нас</span>
          </button>
          
          <button 
            onClick={() => {
              handleNavigation('/contacts');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base ${
              isActive('/contacts') ? 'bg-[#ff6900]/10 text-[#ff6900] font-semibold' : 'hover:bg-gray-50'
            }`}
          >
            <Contact className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Контакты</span>
          </button>
          
          <button 
            onClick={() => {
              handleNavigation('/delivery');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base ${
              isActive('/delivery') ? 'bg-[#ff6900]/10 text-[#ff6900] font-semibold' : 'hover:bg-gray-50'
            }`}
          >
            <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Доставка и оплата</span>
          </button>
        </nav>
      </div>
    </div>
    </>
  );
}

