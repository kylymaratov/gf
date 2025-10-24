"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    // Check if user has already dismissed the prompt
    const hasUserDismissed = localStorage.getItem('pwa-install-dismissed');
    const hasUserInstalled = localStorage.getItem('pwa-install-accepted');

    checkIfInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt if user hasn't dismissed it and hasn't installed
      if (!hasUserDismissed && !hasUserInstalled && !isInstalled) {
        setShowInstallPrompt(true);
      }
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-accepted', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-accepted', 'true');
        setShowInstallPrompt(false);
      } else {
        localStorage.setItem('pwa-install-dismissed', 'true');
        setShowInstallPrompt(false);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true');
    setShowInstallPrompt(false);
  };

  // Don't show if already installed or user has dismissed/installed
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <>
      {/* Desktop - слева снизу */}
      <div className="hidden lg:block fixed bottom-6 left-6 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#ff6900]/10 rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-[#ff6900]" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Установить приложение
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Добавьте GF Store на рабочий стол для быстрого доступа
              </p>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-[#ff6900] hover:bg-[#e55a00] text-white text-xs px-3 py-1.5 h-auto"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Установить
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5 h-auto"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - снизу выезжает */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#ff6900]/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-4 w-4 text-[#ff6900]" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  Установить приложение
                </h3>
                <p className="text-xs text-gray-600">
                  Добавьте на главный экран
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-[#ff6900] hover:bg-[#e55a00] text-white text-xs px-3 py-1.5 h-auto"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Установить
                </Button>
                
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1.5 h-auto"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
