import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, MessageCircle, Send, Twitter, Facebook, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postUrl: string;
  postCaption?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  postUrl,
  postCaption,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copy Link',
      icon: Link2,
      onClick: handleCopyLink,
      color: 'text-blue-500',
    },
    {
      id: 'message',
      label: 'Send via Message',
      icon: MessageCircle,
      onClick: () => console.log('Share via message'),
      color: 'text-green-500',
    },
    {
      id: 'story',
      label: 'Share to Story',
      icon: Share2,
      onClick: () => console.log('Share to story'),
      color: 'text-purple-500',
    },
    {
      id: 'twitter',
      label: 'Share on Twitter',
      icon: Twitter,
      onClick: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          postCaption || 'Check this out!'
        )}&url=${encodeURIComponent(postUrl)}`;
        window.open(twitterUrl, '_blank');
      },
      color: 'text-sky-500',
    },
    {
      id: 'facebook',
      label: 'Share on Facebook',
      icon: Facebook,
      onClick: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          postUrl
        )}`;
        window.open(facebookUrl, '_blank');
      },
      color: 'text-blue-600',
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-bg-card border border-border-primary rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-primary">
                <h2 className="text-lg font-bold text-text-primary">Share Post</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Copy Link Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 bg-bg-tertiary border border-border-primary rounded-xl p-3">
                    <input
                      type="text"
                      value={postUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-text-secondary outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-primary hover:bg-primary-hover text-white'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Share Options */}
                <div className="space-y-2">
                  {shareOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={option.onClick}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${option.color} group-hover:scale-110 transition-transform`}
                      >
                        <option.icon size={20} />
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {option.label}
                      </span>
                      <Send size={16} className="ml-auto text-text-muted" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border-primary">
                <p className="text-xs text-text-muted text-center">
                  Share this post with your friends and followers
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
