import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rounded':
        return 'rounded-xl';
      case 'rectangular':
      default:
        return 'rounded';
    }
  };

  const style = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  const skeleton = (
    <div
      className={`bg-bg-secondary animate-pulse ${getVariantClass()} ${className}`}
      style={style}
    />
  );

  if (count === 1) {
    return skeleton;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeleton}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
