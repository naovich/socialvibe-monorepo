import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, MapPin, Smile } from 'lucide-react';
import { useSocialStore } from '../../../store';
import { useFeed } from '../hooks/useFeed';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useSocialStore();
  const { createPost } = useFeed();
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [vibeTag, setVibeTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!currentUser) return null;

  const vibes = ['😊', '😂', '❤️', '🎉', '😢', '😮', '🤔', '💪', '🔥', '✨', '☕', '🚀'];

  const handleSubmit = async () => {
    if (!caption.trim()) return;

    setIsLoading(true);

    try {
      await createPost({
        caption,
        location: location || undefined,
        vibeTag: vibeTag || undefined,
        privacy: 'public',
      });

      // Reset and close
      setCaption('');
      setLocation('');
      setVibeTag('');
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal-backdrop"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-card border border-border-primary rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary">
                <h2 className="text-xl font-bold text-text-primary">Create Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                >
                  <X size={24} className="text-text-muted" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                  />
                  <div>
                    <h3 className="font-semibold text-text-primary">{currentUser.name}</h3>
                    <p className="text-sm text-text-muted">Public</p>
                  </div>
                </div>

                {/* Caption */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full bg-transparent border-none text-text-primary placeholder:text-text-muted text-lg resize-none outline-none min-h-[120px]"
                  autoFocus
                />

                {/* Vibe Tags */}
                {vibes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-text-muted mb-2">How are you feeling?</p>
                    <div className="flex flex-wrap gap-2">
                      {vibes.map((vibe) => (
                        <button
                          key={vibe}
                          onClick={() => setVibeTag(vibeTag === vibe ? '' : vibe)}
                          className={`p-3 rounded-xl text-2xl transition-all hover:scale-110 ${
                            vibeTag === vibe
                              ? 'bg-primary-light ring-2 ring-primary'
                              : 'bg-bg-secondary hover:bg-bg-tertiary'
                          }`}
                        >
                          {vibe}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-text-muted" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location..."
                      className="flex-1 bg-transparent border-none text-text-primary placeholder:text-text-muted outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-primary">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-text-muted">Add to your post</p>
                  <div className="flex items-center gap-2">
                    <button className="p-3 hover:bg-bg-secondary rounded-full transition-colors">
                      <ImageIcon size={20} className="text-primary" />
                    </button>
                    <button className="p-3 hover:bg-bg-secondary rounded-full transition-colors">
                      <MapPin size={20} className="text-error" />
                    </button>
                    <button className="p-3 hover:bg-bg-secondary rounded-full transition-colors">
                      <Smile size={20} className="text-warning" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!caption.trim() || isLoading}
                  className="w-full py-3 bg-primary hover:bg-primary-hover disabled:bg-bg-tertiary disabled:text-text-disabled disabled:cursor-not-allowed rounded-xl text-text-primary font-semibold transition-all shadow-lg shadow-primary/25"
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
