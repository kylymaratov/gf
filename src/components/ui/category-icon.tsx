"use client";

import { useState } from "react";
import { categoriesService } from "@/services/categories";

interface CategoryIconProps {
  slug: string;
  name: string;
  className?: string;
  iconType?: string;
  isActive?: boolean;
}

export function CategoryIcon({ slug, name, className = "w-8 h-8", iconType = "small", isActive = false }: CategoryIconProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    const colorClass = isActive 
      ? 'text-white' 
      : 'text-gray-400 group-hover:text-[#ff6900]';
    
    return (
      <svg 
        className={`${className} ${colorClass} transition-colors`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    );
  }

  return (
    <img
      src={categoriesService.getCategoryImageUrl(slug, { iconType })}
      alt={name}
      className={`${className} object-contain group-hover:scale-110 transition-transform duration-300`}
      onError={() => setImageError(true)}
    />
  );
}
