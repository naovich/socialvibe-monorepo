import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, MapPin, Smile, Hash, AtSign } from 'lucide-react';
import { useSocialStore } from '../../store';
import VibeTagSelector from '../ui/VibeTagSelector';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addPost } = useSocialStore();
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    for (let i = 0; i < Math.min(files.length, 10); i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === Math.min(files.length, 10)) {
          setImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVibeToggle = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const handleSubmit = async () => {
    if (!caption.trim() && images.length === 0) return;

    setIsLoading(true);
    try {
      await addPost({
        caption,
        image: images[0] || '', // For now, single image
        user: {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
        },
        userId: currentUser.id,
      });

      // Reset form
      setCaption('');
      setImages([]);
      setLocation('');
      setSelectedVibes([]);
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = (caption.trim() || images.length > 0) && !isLoading;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-card border border-border-primary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-primary">
                <h2 className="text-xl font-bold text-text-primary">Create Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-thin">
                <div className="p-4 space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full border-2 border-border-primary"
                    />
                    <div>
                      <p className="font-semibold text-text-primary">{currentUser.name}</p>
                      <p className="text-sm text-text-muted">@{currentUser.username}</p>
                    </div>
                  </div>

                  {/* Caption Input */}
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent border-none outline-none resize-none text-text-primary placeholder:text-text-muted text-lg min-h-[120px]"
                    maxLength={2200}
                  />

                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Vibe Tags */}
                  <VibeTagSelector
                    selectedVibes={selectedVibes}
                    onVibeToggle={handleVibeToggle}
                    maxVibes={3}
                  />

                  {/* Location Input */}
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                    <MapPin className="w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Add location..."
                      className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-primary space-y-3">
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title="Add photos"
                  >
                    <ImageIcon className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Tag people">
                    <AtSign className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Add emoji">
                    <Smile className="w-5 h-5 text-text-secondary" />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Add hashtag">
                    <Hash className="w-5 h-5 text-text-secondary" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div className="flex-1" />

                  <span className="text-sm text-text-muted">
                    {caption.length} / 2200
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    canSubmit
                      ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white/5 text-text-disabled cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
