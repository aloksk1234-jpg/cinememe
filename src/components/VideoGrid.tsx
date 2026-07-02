import React, { useState } from 'react';
import { VideoCard } from './VideoCard';
import type { VideoMeme } from '../data/memes';
import { X, Sparkles } from 'lucide-react';

interface VideoGridProps {
  memes: VideoMeme[];
  isMuted: boolean;
  onToggleMute: () => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  memes,
  isMuted,
  onToggleMute,
  showToast
}) => {
  const [selectedMeme, setSelectedMeme] = useState<VideoMeme | null>(null);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-6xl mx-auto no-scrollbar">
      {memes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500 bg-neutral-900/20 rounded-2xl border border-neutral-800/40">
          <Sparkles className="w-12 h-12 mb-4 text-amber-500/30 animate-pulse" />
          <p className="text-zinc-400 font-semibold text-lg">No matching memes</p>
          <p className="text-zinc-600 text-xs mt-1 text-center px-4">
            We couldn't find any memes matching your criteria. Try searching for something else!
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {memes.map((meme) => (
            <div 
              key={meme.id} 
              className="break-inside-avoid block cursor-pointer transition-all duration-300 hover:scale-[1.01]"
              onClick={() => setSelectedMeme(meme)}
            >
              <VideoCard
                meme={meme}
                isActive={false} // Muted autoplay on hover is handled within VideoCard
                isMuted={isMuted}
                onToggleMute={onToggleMute}
                showToast={showToast}
                layoutMode="grid"
              />
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Video Modal (TikTok layout) */}
      {selectedMeme && (
        <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-lg z-50 flex items-center justify-center p-0 md:p-4 animate-fade-in">
          {/* Close button */}
          <button 
            onClick={() => setSelectedMeme(null)}
            className="absolute top-4 right-4 p-2 rounded-full glass-button text-white z-50 hover:bg-neutral-800/80 transition-all cursor-pointer shadow-xl"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Click outside backdrop */}
          <div 
            className="absolute inset-0 z-10 cursor-pointer" 
            onClick={() => setSelectedMeme(null)}
          />
          
          {/* Modal content */}
          <div className="relative z-20 w-full max-w-2xl h-auto flex items-center justify-center p-4">
            <VideoCard
              meme={selectedMeme}
              isActive={true} // Autoplays inside the modal
              isMuted={isMuted}
              onToggleMute={onToggleMute}
              showToast={showToast}
              layoutMode="landscape"
            />
          </div>
        </div>
      )}
    </div>
  );
};
