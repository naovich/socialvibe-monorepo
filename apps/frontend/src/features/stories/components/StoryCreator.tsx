import React, { useState } from 'react';
import { X, Image as ImageIcon, Type, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (file: File, text?: string) => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ isOpen, onClose, onSelectMedia }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleShare = () => {
    if (selectedFile) {
      onSelectMedia(selectedFile, text);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setText('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-bg-overlay backdrop-blur-sm z-modal-backdrop"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-card border border-border-primary rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            >
              {!previewUrl ? (
                <div className="p-12 text-center">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Create a Story</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="p-8 bg-bg-secondary hover:bg-bg-tertiary rounded-2xl cursor-pointer transition-all border-2 border-dashed border-border-primary hover:border-primary flex flex-col items-center gap-3">
                      <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary">
                        <ImageIcon size={24} />
                      </div>
                      <span className="font-bold text-text-primary">Photo / Video</span>
                    </label>
                    <button className="p-8 bg-bg-secondary hover:bg-bg-tertiary rounded-2xl cursor-pointer transition-all border-2 border-dashed border-border-primary hover:border-primary flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-warning-light rounded-full flex items-center justify-center text-warning">
                        <Type size={24} />
                      </div>
                      <span className="font-bold text-text-primary">Text only</span>
                    </button>
                  </div>
                  <button
                    onClick={handleClose}
                    className="mt-8 text-text-muted hover:text-text-primary font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <div className="aspect-[9/16] bg-black">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div
                      className={`absolute inset-x-6 z-10 text-center ${
                        textPosition === 'top' ? 'top-20' : textPosition === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-20'
                      }`}
                    >
                      {text && (
                        <span className="px-4 py-2 bg-black/50 text-white rounded-lg text-xl font-bold backdrop-blur-sm">
                          {text}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <button
                      onClick={() => setPreviewUrl(null)}
                      className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col gap-4">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type something..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/60 outline-none backdrop-blur-md"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setTextPosition(p => p === 'bottom' ? 'center' : p === 'center' ? 'top' : 'bottom')}
                           className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                         >
                           <Palette size={20} />
                         </button>
                      </div>
                      <button
                        onClick={handleShare}
                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20"
                      >
                        Share Story
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoryCreator;
