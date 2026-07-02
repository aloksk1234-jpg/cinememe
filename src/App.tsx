import { useState, useMemo } from 'react';
import { Search, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { mockMemes } from './data/memes';
import { VideoGrid } from './components/VideoGrid';
import DonationPopup from './components/DonationPopup';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(true); // Default muted to comply with browser autoplay policies
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filter memes based on search query
  const filteredMemes = useMemo(() => {
    return mockMemes.filter(meme => {
      return (
        meme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meme.movieName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [searchQuery]);

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
