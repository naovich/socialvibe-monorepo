import React from 'react';

interface FeedSkeletonProps {
  count?: number;
}

const FeedSkeleton: React.FC<FeedSkeletonProps> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-bg-card border border-border-primary rounded-2xl p-6 shadow-sm animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-bg-secondary rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-bg-secondary rounded w-32 mb-2" />
              <div className="h-3 bg-bg-secondary rounded w-24" />
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-bg-secondary rounded w-full" />
            <div className="h-4 bg-bg-secondary rounded w-3/4" />
          </div>

          {/* Image */}
          <div className="h-80 bg-bg-secondary rounded-xl mb-4" />

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="h-8 bg-bg-secondary rounded w-16" />
            <div className="h-8 bg-bg-secondary rounded w-16" />
            <div className="h-8 bg-bg-secondary rounded w-16" />
          </div>
        </div>
      ))}
    </>
  );
};

export default FeedSkeleton;
