import React from 'react';

interface ClickableTextProps {
  text: string;
  onHashtagClick?: (hashtag: string) => void;
  onMentionClick?: (username: string) => void;
}

const ClickableText: React.FC<ClickableTextProps> = ({
  text,
  onHashtagClick,
  onMentionClick,
}) => {
  // Regex pattern to match hashtags and mentions
  const combinedPattern = /(#\w+|@\w+)/g;

  // Split text by hashtags and mentions
  const parts = text.split(combinedPattern);

  return (
    <>
      {parts.map((part, index) => {
        // Check if it's a hashtag
        if (part.startsWith('#')) {
          const hashtag = part.slice(1);
          return (
            <span
              key={index}
              onClick={() => onHashtagClick?.(hashtag)}
              className="text-primary hover:underline cursor-pointer font-semibold"
            >
              {part}
            </span>
          );
        }

        // Check if it's a mention
        if (part.startsWith('@')) {
          const username = part.slice(1);
          return (
            <span
              key={index}
              onClick={() => onMentionClick?.(username)}
              className="text-primary hover:underline cursor-pointer font-semibold"
            >
              {part}
            </span>
          );
        }

        // Regular text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export default ClickableText;
