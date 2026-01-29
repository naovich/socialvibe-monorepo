import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Smile, MapPin, Users, Globe, ChevronDown, Trash2 } from 'lucide-react';
import { useSocialStore } from '../../store';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addPost } = useSocialStore();
  if (!currentUser) return null;
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [mood, setMood] = useState<{ emoji: string; label: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😇', label: 'Blessed' },
    { emoji: '😎', label: 'Cool' },
    { emoji: '🤩', label: 'Excited' },
    { emoji: '🥰', label: 'Loved' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '🤔', label: 'Thinking' },
    { emoji: '🚀', label: 'Productive' },
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (content.trim() || selectedImage) {
      addPost({
        userId: currentUser.id,
        user: { name: currentUser.name, username: currentUser.username, avatar: currentUser.avatar },
        caption: mood ? `${mood.emoji} Feeling ${mood.label} - ${content}` : content,
        image: selectedImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
      });
      setContent('');
      setSelectedImage(null);
      setMood(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="w-8" />
              <h3 className="text-xl font-bold text-white">Create Post</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar} className="w-11 h-11 rounded-full border border-orange-500/30" />
                <div className="flex flex-col">
                  <span className="font-bold text-white flex items-center gap-1">
                    {currentUser.name}
                    {mood && <span className="text-sm font-normal text-gray-400">— feeling {mood.emoji} {mood.label}</span>}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <button className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-gray-300 transition-colors">
                      <Globe size={12} />
                      Public
                      <ChevronDown size={10} />
                    </button>
                    <button className="flex items-center gap-1.5 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-gray-300 transition-colors">
                      <Users size={12} />
                      Friends
                      <ChevronDown size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <textarea
                placeholder={`What's on your mind, ${currentUser.name}?`}
                className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-gray-500 resize-none min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* Image Preview */}
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                  <img src={selectedImage} alt="Preview" className="w-full max-h-60 object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Mood Picker */}
              <AnimatePresence>
                {showMoodPicker && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid grid-cols-4 gap-2 overflow-hidden"
                  >
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => {
                          setMood(m);
                          setShowMoodPicker(false);
                        }}
                        className={`flex flex-col items-center p-2 rounded-xl transition-all ${mood?.label === m.label ? 'bg-orange-500/20 ring-1 ring-orange-500' : 'hover:bg-white/5'}`}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <span className="text-[10px] text-gray-400 mt-1">{m.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tools */}
              <div className="p-3 border border-white/10 rounded-xl flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-300 ml-2">Add to your post</span>
                <div className="flex gap-1">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-white/5 rounded-full text-green-500 transition-colors"
                    title="Photo/Video"
                  >
                    <ImageIcon size={22} />
                  </button>
                  <button 
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="p-2 hover:bg-white/5 rounded-full text-yellow-500 transition-colors"
                    title="Feeling/Activity"
                  >
                    <Smile size={22} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-full text-red-500 transition-colors" title="Tag People">
                    <Users size={22} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-full text-blue-500 transition-colors" title="Location">
                    <MapPin size={22} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4">
              <button
                onClick={handlePost}
                disabled={!content.trim() && !selectedImage}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  content.trim() || selectedImage 
                    ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20' 
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                Post
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageSelect}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
