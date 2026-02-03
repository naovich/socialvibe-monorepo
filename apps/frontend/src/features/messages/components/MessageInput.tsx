import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string, image?: File) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!text.trim() && !selectedImage) return;

    onSend(text, selectedImage || undefined);
    setText('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-border-primary p-4 bg-bg-card">
      {/* Selected Image Preview */}
      {selectedImage && (
        <div className="mb-2 relative inline-block">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="h-20 rounded-lg"
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-error text-text-primary rounded-full flex items-center justify-center text-xs font-bold hover:bg-error/80"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachments */}
        <div className="flex gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 hover:bg-bg-secondary rounded-full text-primary transition-colors disabled:opacity-50"
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            disabled={disabled}
            className="p-2 hover:bg-bg-secondary rounded-full text-warning transition-colors disabled:opacity-50"
          >
            <Smile size={20} />
          </button>
          <button
            type="button"
            disabled={disabled}
            className="p-2 hover:bg-bg-secondary rounded-full text-info transition-colors disabled:opacity-50"
          >
            <Paperclip size={20} />
          </button>
        </div>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Type a message..."
          className="flex-1 bg-bg-secondary border border-border-primary rounded-2xl px-4 py-2 text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors resize-none max-h-32"
          rows={1}
          style={{
            minHeight: '40px',
            height: 'auto',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedImage) || disabled}
          className="p-3 bg-primary hover:bg-primary-hover disabled:bg-bg-tertiary disabled:text-text-disabled rounded-full text-white transition-all shadow-lg disabled:shadow-none"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
