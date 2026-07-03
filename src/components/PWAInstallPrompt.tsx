import React, { useState, useEffect } from 'react';
import { X, Smartphone, Share, Download, PlusSquare } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / running in Standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true;
    
    if (isStandalone) return;

    // 2. Identify Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(userAgent);
    const androidDevice = /android/.test(userAgent);
    const isMobile = iosDevice || androidDevice || (window.innerWidth < 768);

    // Only show on mobile devices
    if (!isMobile) return;

    setIsIOS(iosDevice);

    // 3. Handle Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not previously dismissed in this session
      const dismissed = sessionStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Handle iOS setup (since beforeinstallprompt is NOT supported on iOS)
    if (iosDevice) {
      const dismissed = sessionStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
        // Show install invitation on iOS Safari
        setShowPrompt(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show guided bottom sheet instructions for iOS
      setShowIOSGuide(true);
    } else if (deferredPrompt) {
      // Trigger native install dialog for Android
      setShowPrompt(false);
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for devices supporting PWA but lacking beforeinstallprompt
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showPrompt && !showIOSGuide) return null;

  return (
    <>
      {/* Floating Prompt Bar (visible at bottom of mobile viewport) */}
      {showPrompt && !showIOSGuide && (
        <div className="fixed bottom-20 left-4 right-4 z-40 bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-zinc-100 leading-tight">Add to Phone</h4>
              <p className="text-[10px] text-zinc-400 font-medium">Install Cinememe for instant offline access!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-amber-500 text-neutral-950 font-extrabold text-[11px] uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-950/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[3]" />
              <span>Install</span>
            </button>
            <button 
              onClick={handleDismiss}
              className="text-zinc-500 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Guided Instruction Bottom Sheet Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
          {/* Backdrop click dismiss */}
          <div className="absolute inset-0" onClick={() => setShowIOSGuide(false)} />
          
          <div className="relative z-10 w-full bg-neutral-900 border-t border-neutral-800 rounded-t-3xl p-6 shadow-2xl flex flex-col gap-4 animate-slide-up max-w-md pb-8">
            <button 
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-neutral-800 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                <img src="/logo.png" alt="Cinememe Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h3 className="text-base font-black text-zinc-100">Install Cinememe</h3>
                <p className="text-xs text-zinc-400 font-semibold">Follow these 2 simple steps to add it to your iPhone:</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 bg-neutral-950/65 rounded-2xl p-4 border border-neutral-800/40">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 text-zinc-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                  Tap the <span className="inline-flex items-center text-amber-400 font-extrabold mx-1 gap-1"><Share className="w-3.5 h-3.5" /> Share</span> button in the Safari bottom browser bar.
                </p>
              </div>

              <div className="h-px bg-neutral-900" />

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-800 text-zinc-300 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                  Scroll down the share list and select <span className="inline-flex items-center text-amber-400 font-extrabold mx-1 gap-1"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</span>.
                </p>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowIOSGuide(false);
                setShowPrompt(false);
                sessionStorage.setItem('pwa_install_dismissed', 'true');
              }}
              className="w-full bg-neutral-800 hover:bg-neutral-750 text-zinc-200 font-bold text-xs py-3 rounded-xl cursor-pointer transition-all active:scale-98"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
