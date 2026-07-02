import React, { useState } from 'react';
import type { VideoMeme } from '../data/memes';
import { X, Save, Loader2 } from 'lucide-react';

interface EditMetadataModalProps {
  meme: VideoMeme;
  onClose: () => void;
  onSave: (updated: Partial<VideoMeme>) => Promise<void>;
}

export const EditMetadataModal: React.FC<EditMetadataModalProps> = ({ meme, onClose, onSave }) => {
  const [title, setTitle] = useState(meme.title);
  const [movieName, setMovieName] = useState(meme.movieName);
  const [tags, setTags] = useState(meme.tags.join(', '));
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      await onSave({ title, movieName, tags: parsedTags });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 animate-fade-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Metadata</h2>
          <button onClick={onClose} className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Movie Name</label>
            <input 
              type="text" 
              value={movieName} 
              onChange={e => setMovieName(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Scene Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Tags (comma separated)</label>
            <input 
              type="text" 
              value={tags} 
              onChange={e => setTags(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-5 py-2.5 rounded-lg font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save to Codebase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
