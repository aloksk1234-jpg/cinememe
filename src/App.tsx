import { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertCircle, Info, Heart } from 'lucide-react';
import { mockMemes } from './data/memes';
import { VideoGrid } from './components/VideoGrid';
import DonationPopup from './components/DonationPopup';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay policies
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [randomizedMemes] = useState(() => shuffleArray(mockMemes));

  // Filter memes based on search query
  const filteredMemes = useMemo(() => {
    return randomizedMemes.filter(meme => {
      return (
        meme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meme.movieName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [searchQuery, randomizedMemes]);

  // Toast Handler
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Automatically remove after 4s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
    showToast(!isMuted ? "Volume turned ON" : "Volume MUTED", "info");
  };

  // Esc key closes modal (handled inside VideoGrid, but we can also listen to mute keys if needed)
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans select-none antialiased">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-4 py-3.5 flex flex-col gap-3">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Cinememe Logo" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent m-0 leading-none drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              Cinememe
            </h1>
          </div>
        </div>

        {/* Search Input Layout */}
        <div className="max-w-6xl w-full mx-auto">
          {/* Search Input */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search memes, movies, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 text-sm border border-neutral-800 text-zinc-100 pl-10 pr-4 py-2.5 rounded-xl placeholder-zinc-500 focus:outline-none focus:border-amber-500/85 focus:ring-1 focus:ring-amber-500/85 transition-all duration-200"
            />
          </div>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 flex flex-col min-h-0 bg-neutral-950">
        <VideoGrid
          memes={filteredMemes}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          showToast={showToast}
        />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-neutral-905/70 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
          <span>with love</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-zinc-400 font-semibold">Alok</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/aloksk1234-jpg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
            title="GitHub"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a 
            href="https://x.com/AlokSK9" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
            title="Twitter"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/alok_sarath_?igsh=bzNwNWI5OTliajA5&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
            title="Instagram"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </footer>

      {/* Global Toast Notification System */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md pointer-events-auto animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-950/85 border-emerald-800/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/85 border-rose-800/40 text-rose-300'
                : 'bg-neutral-900/90 border-neutral-800 text-zinc-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />}
            <span className="text-xs font-semibold leading-normal">{toast.message}</span>
          </div>
        ))}
      </div>
      <DonationPopup />
    </div>
  );
}

export default App;
