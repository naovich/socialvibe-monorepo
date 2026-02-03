import React, { useState, useEffect } from 'react';
import { useSocialStore } from '../../../store';
import type { Post } from '../../../types';

interface PhotosGridProps {
  userId: string;
  limit?: number;
  onPhotoClick?: (post: Post) => void;
}

const PhotosGrid: React.FC<PhotosGridProps> = ({ userId, limit = 9, onPhotoClick }) => {
  const [photos, setPhotos] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchUserPosts = useSocialStore((state) => state.fetchUserPosts);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      const posts = await fetchUserPosts(userId);
      // Filter only posts with images
      const postsWithImages = posts.filter(post => post.image);
      setPhotos(postsWithImages.slice(0, limit));
      setLoading(false);
    };

    loadPhotos();
  }, [userId, limit, fetchUserPosts]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="aspect-square bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        <p className="text-sm">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
      {photos.map((post) => (
        <div
          key={post.id}
          className="aspect-square relative group cursor-pointer overflow-hidden"
          onClick={() => onPhotoClick?.(post)}
        >
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-4 text-text-primary">
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="text-sm font-bold">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold">{post.comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotosGrid;
