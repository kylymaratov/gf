import { useState, useEffect } from 'react';
import { Product } from '@/services/products';

const RECENTLY_VIEWED_KEY = 'recently-viewed-products';
const MAX_RECENT_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Загружаем данные из localStorage при инициализации
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentlyViewed(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
        setRecentlyViewed([]);
      }
    }
  }, []);

  // Добавляем товар в список просмотренных
  const addToRecentlyViewed = (product: Product) => {
    if (typeof window === 'undefined') return;

    setRecentlyViewed(prev => {
      // Удаляем товар, если он уже есть в списке (по SKU)
      const filtered = prev.filter(p => p.sku !== product.sku);
      
      // Добавляем товар в начало списка
      const updated = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      // Сохраняем в localStorage
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recently viewed products:', error);
      }
      
      return updated;
    });
  };

  // Очищаем список просмотренных товаров
  const clearRecentlyViewed = () => {
    if (typeof window === 'undefined') return;
    
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed products:', error);
    }
  };

  return {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
  };
}
