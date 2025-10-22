"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetOverlayProps {
  onClick: () => void;
}

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetOverlay({ onClick }: SheetOverlayProps) {
  const { open } = React.useContext(SheetContext);
  const overlayClassName = [
    "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
  ].join(" ");

  return <div className={overlayClassName} onClick={onClick} />;
}

export function SheetContent({ children, className }: SheetContentProps) {
  const { open, onOpenChange } = React.useContext(SheetContext);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onOpenChange]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      {children}
    </div>
  );
}
