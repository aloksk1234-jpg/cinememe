import { useState, useEffect } from "react";
import { X, Coffee } from "lucide-react";

export default function DonationPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if the user has dismissed the popup recently
    const dismissed = localStorage.getItem("chai_donated_dismissed");
    if (!dismissed) {
      // Small 5-second delay before showing so it's not jarring on page load
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    // Don't show again once they dismiss it or click support
    localStorage.setItem("chai_donated_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 md:max-w-sm bg-neutral-900/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-black/80 rounded-2xl p-5 z-50 transition-all duration-500 ease-out translate-y-0 opacity-100"
      style={{ animation: 'slideUp 0.5s ease-out' }}
      onClick={(e) => e.stopPropagation()}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <button 
        onClick={handleDismiss} 
        className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-white transition-colors bg-neutral-800/60 hover:bg-neutral-800 rounded-full p-1.5 border border-neutral-700/30 cursor-pointer"
        aria-label="Close"
      >
        <X size={14} />
      </button>
      
      <div className="flex items-start gap-4 pr-4">
        <div className="bg-amber-950/50 text-amber-400 p-3 rounded-2xl flex-shrink-0 shadow-inner mt-1 border border-amber-500/20">
          <Coffee size={24} />
        </div>
        <div>
          <h3 className="font-extrabold text-zinc-100 text-base mb-1 tracking-tight">Buy me a Chai? ☕</h3>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed font-medium">
            Help this broke dude maintain the server bandwidth so everyone can keep enjoying the ambience!
          </p>
          <a 
            href="https://www.buymeachai.in/kattanchaya" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleDismiss}
            className="inline-flex bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black text-[11px] tracking-wider uppercase px-5 py-2.5 rounded-full shadow-lg shadow-orange-950/20 hover:from-amber-400 hover:to-orange-500 hover:shadow-xl active:scale-95 transition-all cursor-pointer"
          >
            Support the Server
          </a>
        </div>
      </div>
    </div>
  );
}
