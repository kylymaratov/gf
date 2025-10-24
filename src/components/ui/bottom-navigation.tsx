"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, UserCircle, Home, Menu, Grid3X3 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { transitions } from "@/lib/view-transitions";

interface BottomNavigationProps {}

export function BottomNavigation({}: BottomNavigationProps) {
  const totalItems = useCartStore((state) => state.getUniqueItemsCount());
  const [isClient, setIsClient] = useState(false);
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

  const navItems = [
    {
      id: 'home',
      href: '/',
      icon: Home,
      label: 'Главная',
      isActive: isActive('/')
    },
    {
      id: 'categories',
      href: '/categories',
      icon: Menu,
      label: 'Категории',
      isActive: isActive('/categories')
    },
    {
      id: 'catalog',
      href: '/catalog',
      icon: Grid3X3,
      label: 'Каталог',
      isActive: isActive('/catalog')
    },
    {
      id: 'cart',
      href: '/cart',
      icon: ShoppingBag,
      label: 'Корзина',
      isActive: isActive('/cart'),
      badge: isClient && totalItems > 0 ? totalItems : null
    },
    {
      id: 'profile',
      href: '/profile',
      icon: UserCircle,
      label: 'Профиль',
      isActive: isActive('/profile'),
      inDevelopment: true
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-200/50 shadow-lg lg:hidden">
      {/* Safe area for devices with home indicator */}
      <div className="pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = item.isActive;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.href !== '#') {
                    handleNavigation(item.href, item.inDevelopment);
                  }
                }}
                className={`flex flex-col items-center justify-center py-2 px-2 min-w-0 flex-1 relative group ${
                  isItemActive 
                    ? 'text-[#ff6900]' 
                    : item.inDevelopment 
                      ? 'text-gray-400' 
                      : 'text-gray-600 active:text-[#ff6900]'
                } transition-all duration-200 active:scale-95`}
              >
                {/* Icon container with background on active */}
                <div className={`relative p-1.5 rounded-full transition-all duration-200 ${
                  isItemActive 
                    ? 'bg-[#ff6900]/10 scale-110' 
                    : 'group-active:bg-gray-100'
                }`}>
                  <Icon className={`h-4 w-4 transition-all duration-200 ${
                    isItemActive ? 'scale-110' : ''
                  }`} />
                  
                  {/* Badge for cart - теперь внутри контейнера иконки */}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#ff6900] text-[9px] font-bold text-white flex items-center justify-center shadow-lg border border-white">
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Development indicator */}
                  {item.inDevelopment && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-orange-500 border border-white shadow-sm"></span>
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-medium truncate max-w-full transition-all duration-200 ${
                  isItemActive ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isItemActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#ff6900] rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
