"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/view-transitions";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const router = useRouter();

  const handleHomeNavigation = () => {
    transitions.slide(() => {
      router.push('/');
    });
  };

  return (
    <button 
      onClick={handleHomeNavigation}
      className={cn("flex items-center gap-3", className)}
    >
      <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
        <span className="text-white font-bold text-xl">G</span>
      </div>
      <span className="text-xl font-bold text-black uppercase">
        general
      </span>
    </button>
  );
}


