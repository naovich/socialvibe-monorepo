import React, { useState } from 'react';
import { useStories } from '../hooks/useStories';
import StoryCircle from './StoryCircle';
import StoryViewer from './StoryViewer';
import StoryCreator from './StoryCreator';

const StoriesList: React.FC = () => {
  const { storyGroups, viewStory, createStory, reactToStory, isLoading } = useStories();
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const handleSelectMedia = async (file: File, text?: string) => {
    try {
      await createStory({
        media: file,
        text,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-4 items-center overflow-x-auto py-6 scrollbar-hide">
      {/* Add Story Button */}
      <StoryCircle isMe onClick={() => setIsCreatorOpen(true)} />

      {/* Story Groups */}
      {storyGroups.map((group, index) => (
        <StoryCircle
          key={group.userId}
          group={group}
          onClick={() => setActiveGroupIndex(index)}
        />
      ))}

      {/* Skeletons */}
      {isLoading && storyGroups.length === 0 && (
        <div className="flex gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-16 h-16 rounded-full bg-bg-secondary animate-pulse" />
          ))}
        </div>
      )}

      {/* Story Viewer Modal */}
      {activeGroupIndex !== null && (
        <StoryViewer
          groups={storyGroups}
          initialGroupIndex={activeGroupIndex}
          onClose={() => setActiveGroupIndex(null)}
          onViewStory={viewStory}
          onReact={reactToStory}
        />
      )}

      {/* Story Creator Modal */}
      <StoryCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSelectMedia={handleSelectMedia}
      />
    </div>
  );
};

export default StoriesList;
