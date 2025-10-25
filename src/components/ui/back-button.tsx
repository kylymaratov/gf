"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { transitions } from "@/lib/view-transitions";

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export function BackButton({ className = "", onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      transitions.slide(() => {
        router.back();
      });
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Назад
    </Button>
  );
}
