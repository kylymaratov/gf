"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, UserCircle, Menu, Phone, MapPin, Clock, Mail, Sparkles, Facebook, Twitter, Instagram, Contact, User, ShoppingCart } from "lucide-react";
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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavigation = (href: string) => {
    transitions.slide(() => {
      router.push(href);
    });
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Logo />

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
            onClick={onCategoriesClick}
            title="Открыть меню категорий товаров"
          >
            <div className="p-1 bg-gray-200 dark:bg-gray-700 rounded">
              <Menu className="h-4 w-4" />
            </div>
            <span className="text-gray-900 dark:text-gray-200">Категории</span>
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
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 z-50">
                {/* Address */}
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Наш адрес</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Кыргызстан г. Бишкек ул. Киевская 168, 720001</p>
                  </div>
                </div>

                {/* Phones */}
                <div className="flex items-start gap-3 mb-4">
                  <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Телефоны:</h3>
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
                  <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Время работы</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Режим работы:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Понедельник - воскресенье с 10:00 - 20:00 ч.</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Без обеда</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">@ E-mail</h3>
                    <a href="mailto:info@softech.kg" className="text-sm text-red-500 underline hover:text-red-600">
                      info@softech.kg
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Мы в соцсетях</h3>
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

        {/* Actions */}
        <div className="flex items-center space-x-5">
          <div className="flex flex-col items-center -mt-2">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex h-8 w-8" title="Поиск товаров">
              <Search className="h-[30px] w-[30px]" />
            </Button>
            <span className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">Поиск</span>
          </div>
          
          <div className="flex flex-col items-center -mt-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              title="Мой профиль"
              onClick={() => handleNavigation('/profile')}
            >
              <UserCircle className="h-[30px] w-[30px]" />
            </Button>
            <span className="text-xs text-gray-600 dark:text-gray-400">Профиль</span>
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
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff6900] text-[10px] font-bold text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900">
                  {totalItems}
                </span>
              )}
            </Button>
            <span className="text-xs text-gray-600 dark:text-gray-400">Корзина</span>
          </div>

        </div>
      </div>
    </header>
    </>
  );
}

