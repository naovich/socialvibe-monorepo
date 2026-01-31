import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHTMLProps {
  content: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

/**
 * SafeHTML - Sanitize user-generated content to prevent XSS attacks
 * 
 * Uses DOMPurify to strip dangerous HTML/JS while keeping safe formatting
 * 
 * @example
 * <SafeHTML content={post.caption} className="text-white" />
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ 
  content, 
  className = '', 
  as: Component = 'p' 
}) => {
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default SafeHTML;
