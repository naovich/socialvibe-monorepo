import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface PostSkeletonProps {
  count?: number;
}

const PostSkeleton: React.FC<PostSkeletonProps> = ({ count = 1 }) => {
  const skeleton = (
    <div className="bg-bg-card border border-border-primary rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonLoader variant="circular" width={48} height={48} />
        <div className="flex-1">
          <SkeletonLoader variant="text" width="40%" height={20} className="mb-2" />
          <SkeletonLoader variant="text" width="30%" height={16} />
        </div>
      </div>

      {/* Caption */}
      <SkeletonLoader variant="text" count={3} className="mb-4" />

      {/* Image */}
      <SkeletonLoader variant="rounded" height={300} className="mb-4" />

      {/* Actions */}
      <div className="flex items-center gap-6">
        <SkeletonLoader variant="rounded" width={80} height={24} />
        <SkeletonLoader variant="rounded" width={80} height={24} />
        <SkeletonLoader variant="rounded" width={80} height={24} />
      </div>
    </div>
  );

  if (count === 1) {
    return skeleton;
  }

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{skeleton}</div>
      ))}
    </div>
  );
};

export default PostSkeleton;
