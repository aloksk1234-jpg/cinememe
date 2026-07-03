import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Share2, Volume2, VolumeX, Heart } from 'lucide-react';
import type { VideoMeme } from '../data/memes';
import { EditMetadataModal } from './EditMetadataModal';

interface VideoCardProps {
  meme: VideoMeme;
  isActive: boolean; // Used to trigger autoplay/pause in Feed mode
  isMuted: boolean;
  onToggleMute: () => void;
  showToast: (message: string, type: 'success' | 'info' | 'error') => void;
  layoutMode: 'feed' | 'grid' | 'landscape';
}

export const VideoCard: React.FC<VideoCardProps> = ({
  meme,
  isActive,
  isMuted,
  onToggleMute,
  showToast,
  layoutMode
}) => {
  const { title, videoUrl, likes, shares, tags, creator, movieName } = meme;
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [showControlOverlay, setShowControlOverlay] = useState<'play' | 'pause' | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveMetadata = async (updated: Partial<VideoMeme>) => {
    try {
      const response = await fetch('/api/save-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          index: meme.originalIndex,
          data: {
            title: updated.title,
            movieName: updated.movieName,
            tags: updated.tags,
            creator: meme.creator // preserve creator
          }
        })
      });
      
      if (response.ok) {
        showToast('Metadata saved to codebase! Reloading...', 'success');
        setShowEditModal(false);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const err = await response.json();
        showToast('Failed to save: ' + err.error, 'error');
      }
    } catch (err: any) {
      showToast('Save failed: ' + err.message, 'error');
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);

  // Sync active state from Feed
  useEffect(() => {
    if ((layoutMode === 'feed' || layoutMode === 'landscape') && videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, layoutMode]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerControlOverlay('pause');
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        triggerControlOverlay('play');
      }).catch(err => {
        console.error("Playback interrupted:", err);
      });
    }
  };

  const triggerControlOverlay = (type: 'play' | 'pause') => {
    setShowControlOverlay(type);
    setTimeout(() => {
      setShowControlOverlay(null);
    }, 500);
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setVideoProgress(isNaN(progress) ? 0 : progress);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    videoRef.current.currentTime = percentage * videoRef.current.duration;
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      if (!hasLiked) {
        setHasLiked(true);
        showToast("Added to Liked Memes!", "success");
      }
      setShowHeartOverlay(true);
      setTimeout(() => setShowHeartOverlay(false), 800);
    } else {
      // Single tap -> Play/Pause toggle
      togglePlay();
    }
    lastTapRef.current = now;
  };

  // 3. Direct Downloader with Progress Tracking
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloadProgress !== null) return; // Prevent multiple clicks

    setDownloadProgress(0);
    showToast("Starting download...", "info");

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Network response was not OK");
      if (!response.body) throw new Error("No response body");

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) {
          const progress = Math.round((loaded / total) * 100);
          setDownloadProgress(progress);
        }
      }

      const blob = new Blob(chunks as any[], { type: 'video/mp4' });
      const downloadLink = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      
      const fileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp4`;
      downloadLink.href = objectUrl;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(objectUrl);

      setDownloadProgress(null);
      showToast("Download completed!", "success");
    } catch (error) {
      console.warn("CORS/Fetch download failed. Using direct download fallback...", error);
      setDownloadProgress(null);
      
      // Fallback: Open video stream directly in a new tab with download instructions or trigger browser native download
      showToast("Redirecting to video file for direct download...", "info");
      
      setTimeout(() => {
        const fallbackLink = document.createElement('a');
        fallbackLink.href = videoUrl;
        fallbackLink.target = '_blank';
        fallbackLink.rel = 'noopener noreferrer';
        fallbackLink.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp4`;
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
      }, 300);
    }
  };

  // 4. WhatsApp Sharing via navigator.share File API
  const handleWhatsAppShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSharing) return;

    setIsSharing(true);
    showToast("Preparing video for sharing...", "info");

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error("Failed to fetch video for sharing.");
      
      const blob = await response.blob();
      const fileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp4`;
      const file = new File([blob], fileName, { type: 'video/mp4' });

      // Check if navigator.share and file sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: title,
          text: `Check out this meme from "${movieName}": "${title}"`
        });
        showToast("Shared successfully!", "success");
      } else {
        // Fallback for Desktop or unsupported devices: share link instead of file
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: `Check out this meme from "${movieName}": "${title}"\n${videoUrl}`
          });
          showToast("Shared via link successfully!", "success");
        } else {
          await navigator.clipboard.writeText(videoUrl);
          showToast("Meme link copied to clipboard!", "success");
        }
      }
    } catch (error) {
      console.warn("File sharing failed, falling back to link sharing:", error);
      
      // Fallback: share link instead of file
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: `Check out this meme from "${movieName}": "${title}"\n${videoUrl}`
          });
          showToast("Shared via link successfully!", "success");
        } else {
          await navigator.clipboard.writeText(videoUrl);
          showToast("Meme link copied to clipboard!", "success");
        }
      } catch (err) {
        console.error("Link sharing fallback failed:", err);
        showToast("Sharing failed.", "error");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Play preview on hover (only in grid mode on desktop)
  const handleMouseEnter = () => {
    if (layoutMode === 'grid' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (layoutMode === 'grid' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setVideoProgress(0);
    }
  };

  return (
    <div 
      className={`relative bg-neutral-900 border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-neutral-700/80 shadow-2xl ${
        layoutMode === 'feed' 
          ? 'h-full w-full max-w-md mx-auto rounded-none md:rounded-2xl border-none md:border' 
          : layoutMode === 'landscape'
          ? 'w-full max-w-2xl border-neutral-850'
          : 'w-full'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Container */}
      <div 
        className={`relative bg-black flex items-center justify-center cursor-pointer select-none overflow-hidden ${
          layoutMode === 'feed' ? 'flex-1 min-h-0' : 'aspect-video'
        }`}
        onClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className={`w-full h-full ${layoutMode === 'landscape' ? 'object-contain bg-neutral-950' : 'object-cover'} ${layoutMode === 'feed' ? 'max-h-full' : ''}`}
          loop
          playsInline
          muted={isMuted}
          onTimeUpdate={handleVideoTimeUpdate}
          onLoadStart={() => setIsBuffering(true)}
          onCanPlay={() => setIsBuffering(false)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
        />

        {/* Buffering/Loading Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Double-Tap Heart Overlay Animation */}
        {showHeartOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-ping absolute">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 opacity-75" />
            </div>
            <div className="animate-bounce-short">
              <Heart className="w-20 h-20 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
            </div>
          </div>
        )}

        {/* Tap Action Control Overlay (Play/Pause flash) */}
        {showControlOverlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-black/60 p-4 rounded-full animate-scale-fade flex items-center justify-center">
              {showControlOverlay === 'play' ? (
                <Play className="w-8 h-8 text-white fill-white" />
              ) : (
                <Pause className="w-8 h-8 text-white fill-white" />
              )}
            </div>
          </div>
        )}

        {/* Mute Indicator overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className={`absolute right-4 p-2.5 rounded-full glass-button z-10 text-white ${
            layoutMode === 'feed' ? 'bottom-16 md:bottom-20' : 'bottom-4'
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Edit Metadata Button overlay - Hidden for now */}
        {/* 
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowEditModal(true);
          }}
          className="absolute right-4 top-4 p-2 rounded-full bg-neutral-900/60 hover:bg-amber-600/80 backdrop-blur-md z-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          title="Edit Metadata"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        */}

        {/* Watermark/Creator info overlay for TikTok Feed */}
        {layoutMode === 'feed' && (
          <div className="absolute bottom-16 left-4 right-14 z-10 pointer-events-none text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-600/80 text-white mb-2 backdrop-blur-xs">
              {movieName}
            </span>
            <p className="font-semibold text-white text-base truncate">{creator}</p>
            <p className="text-zinc-200 text-xs mt-1 font-medium line-clamp-2 leading-relaxed">
              {title}
            </p>
          </div>
        )}

        {/* Custom progress scrubber at the bottom of the video */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/80 hover:h-2 cursor-pointer transition-all duration-150 z-10"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-amber-500 rounded-r-md transition-all duration-75 relative"
            style={{ width: `${videoProgress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Info & Action Bar below video (mainly for Grid, or structured info) */}
      <div className={`p-4 flex flex-col justify-between flex-shrink-0 ${layoutMode === 'feed' ? 'bg-neutral-900 border-t border-neutral-800/80' : 'flex-1 bg-neutral-900/60'}`}>
        {/* Title for Grid/Landscape View */}
        {(layoutMode === 'grid' || layoutMode === 'landscape') && (
          <div className="text-left mb-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/30">
                {movieName}
              </span>
              <span className="text-xs text-zinc-500">{creator}</span>
            </div>
            <h3 className="font-semibold text-zinc-100 text-sm leading-snug line-clamp-2 group-hover:text-amber-400 transition-colors">
              {title}
            </h3>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-md font-medium hover:bg-neutral-700/80 hover:text-neutral-200 transition-colors duration-150"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between border-t border-neutral-800/60 pt-3">
          {/* Likes & Stats */}
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setHasLiked(!hasLiked);
                showToast(hasLiked ? "Removed Like" : "Liked!", hasLiked ? "info" : "success");
              }}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-rose-500 transition-colors active:scale-90"
              title="Like"
            >
              <Heart className={`w-5 h-5 ${hasLiked ? 'text-rose-500 fill-rose-500 animate-scale-up' : ''}`} />
              <span className="text-xs font-semibold">{likes + (hasLiked ? 1 : 0)}</span>
            </button>

            <div className="flex items-center gap-1.5 text-zinc-500">
              <span className="text-xs">{shares} shares</span>
            </div>
          </div>

          {/* Download & Share Actions */}
          <div className="flex items-center gap-2">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloadProgress !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-250 select-none ${
                downloadProgress !== null
                  ? 'bg-amber-950/60 text-amber-400 border border-amber-800/30'
                  : 'bg-amber-600/90 text-white hover:bg-amber-500 active:scale-95'
              }`}
              title="Download MP4"
            >
              {downloadProgress !== null ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-500/20 border-t-amber-400 rounded-full animate-spin"></div>
                  <span>{downloadProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </>
              )}
            </button>

            {/* Share to WhatsApp Button */}
            <button
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none border border-emerald-800/50 transition-all duration-200 ${
                isSharing
                  ? 'bg-emerald-950/50 text-emerald-400'
                  : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800/30 active:scale-95'
              }`}
              title="Share file to WhatsApp"
            >
              {isSharing ? (
                <div className="w-3.5 h-3.5 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditMetadataModal
          meme={meme}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveMetadata}
        />
      )}
    </div>
  );
};
