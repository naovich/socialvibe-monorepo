import React, { useState, useEffect, useCallback } from 'react';
import { X, Send, Heart } from 'lucide-react';
import type { StoryGroup } from '../types/story.types';

interface StoryViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
  onViewStory: (storyId: string) => void;
  onReact: (storyId: string, emoji: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  groups,
  initialGroupIndex,
  onClose,
  onViewStory,
  onReact,
}) => {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = groups[groupIndex];
  const currentStory = currentGroup?.stories[storyIndex];

  const nextStory = useCallback(() => {
    if (storyIndex < currentGroup.stories.length - 1) {
      setStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex(prev => prev + 1);
      setStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [storyIndex, groupIndex, currentGroup, groups, onClose]);

  const prevStory = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      setGroupIndex(prev => prev - 1);
      setStoryIndex(prevGroup.stories.length - 1);
      setProgress(0);
    }
  }, [storyIndex, groupIndex, groups]);

  useEffect(() => {
    if (!currentStory) return;

    onViewStory(currentStory.id);

    const duration = (currentStory.duration || 5) * 1000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentStory, nextStory, onViewStory]);

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
      >
        <X size={32} />
      </button>

      <div className="absolute inset-y-0 left-0 w-1/4 z-40" onClick={prevStory} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-40" onClick={nextStory} />

      <div className="relative w-full max-w-[500px] h-full max-h-[900px] bg-bg-tertiary overflow-hidden md:rounded-2xl">
        <div className="absolute top-4 inset-x-4 z-50 flex gap-1">
          {currentGroup.stories.map((story, idx) => (
            <div key={story.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all"
                style={{
                  width: `${idx === storyIndex ? progress : idx < storyIndex ? 100 : 0}%`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-10 inset-x-4 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentGroup.user.avatar}
              alt={currentGroup.user.name}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="text-white">
              <h3 className="font-bold">{currentGroup.user.name}</h3>
              <p className="text-xs text-white/80">
                {new Date(currentStory.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={currentStory.media.url}
            alt="Story"
            className="w-full h-full object-cover"
          />
        </div>

        {currentStory.text && (
          <div
            className={`absolute inset-x-6 z-40 p-4 text-center ${
              currentStory.textPosition === 'top'
                ? 'top-32'
                : currentStory.textPosition === 'center'
                ? 'top-1/2 -translate-y-1/2'
                : 'bottom-32'
            }`}
          >
            <span
              className="px-4 py-2 rounded-xl text-xl font-bold"
              style={{
                color: currentStory.textStyle?.color || '#ffffff',
                backgroundColor: currentStory.textStyle?.backgroundColor || 'rgba(0,0,0,0.5)',
              }}
            >
              {currentStory.text}
            </span>
          </div>
        )}

        <div className="absolute bottom-8 inset-x-4 z-50 flex items-center gap-3">
          <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-3">
            <input
              type="text"
              placeholder="Send message..."
              className="bg-transparent border-none text-white placeholder:text-white/60 outline-none flex-1"
              onClick={(e) => e.stopPropagation()}
            />
            <button className="text-white/80 hover:text-white">
              <Send size={20} />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReact(currentStory.id, '❤️');
            }}
            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <Heart size={24} className="fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
