import React, { useState } from 'react';
import { X, Link2, Send, MessageCircle, Facebook, Twitter, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: copied ? Check : Link2,
      onClick: handleCopyLink,
      color: 'bg-blue-500',
    },
    {
      id: 'dm',
      label: 'Send via DM',
      icon: Send,
      onClick: () => console.log('Share via DM'),
      color: 'bg-purple-500',
    },
    {
      id: 'story',
      label: 'Share to Story',
      icon: MessageCircle,
      onClick: () => console.log('Share to Story'),
      color: 'bg-pink-500',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank'),
      color: 'bg-blue-600',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank'),
      color: 'bg-sky-500',
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      onClick: () => window.location.href = `mailto:?body=${encodeURIComponent(postUrl)}`,
      color: 'bg-gray-500',
    },
  ];

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
          <div className="fixed inset-0 flex items-center justify-center p-4 z-modal pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-card border border-border-primary rounded-2xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-primary">
                <h2 className="text-xl font-bold text-text-primary">Share Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-secondary rounded-full transition-colors"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  {shareOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={option.onClick}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-bg-secondary transition-all group"
                    >
                      <div className={`${option.color} w-12 h-12 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <option.icon size={24} />
                      </div>
                      <span className="text-xs font-medium text-text-primary text-center">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
