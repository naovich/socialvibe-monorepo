import React from 'react';
import DOMPurify from 'dompurify';

interface ClickableTextProps {
  text: string;
  onHashtagClick?: (hashtag: string) => void;
  onMentionClick?: (username: string) => void;
  className?: string;
}

const ClickableText: React.FC<ClickableTextProps> = ({
  text,
  onHashtagClick,
  onMentionClick,
  className = '',
}) => {
  // Sanitize input to prevent XSS attacks
  const sanitizedText = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });

  // Regex pattern for hashtags and mentions
  const combinedRegex = /(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)/g;

  const parseText = (inputText: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Find all matches
    const matches = Array.from(inputText.matchAll(combinedRegex));

    matches.forEach((match, idx) => {
      const matchText = match[0];
      const matchIndex = match.index!;

      // Add text before the match
      if (matchIndex > lastIndex) {
        parts.push(inputText.substring(lastIndex, matchIndex));
      }

      // Add the clickable element
      if (matchText.startsWith('#')) {
        const hashtag = matchText.substring(1);
        parts.push(
          <button
            key={`hashtag-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              onHashtagClick?.(hashtag);
            }}
            className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors"
          >
            {matchText}
          </button>
        );
      } else if (matchText.startsWith('@')) {
        const username = matchText.substring(1);
        parts.push(
          <button
            key={`mention-${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              onMentionClick?.(username);
            }}
            className="text-primary hover:text-primary-hover hover:underline font-medium transition-colors"
          >
            {matchText}
          </button>
        );
      }

      lastIndex = matchIndex + matchText.length;
    });

    // Add remaining text
    if (lastIndex < inputText.length) {
      parts.push(inputText.substring(lastIndex));
    }

    return parts;
  };

  return (
    <span className={className}>
      {parseText(sanitizedText)}
    </span>
  );
};

export default ClickableText;
