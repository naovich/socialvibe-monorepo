import { useState, useEffect, useCallback } from 'react';
import type { StoryGroup, CreateStoryData } from '../types/story.types';
import { storiesService } from '../services/storiesService';

export const useStories = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const groups = await storiesService.getStoryGroups();
      setStoryGroups(groups);
    } catch (err) {
      setError('Failed to load stories');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const viewStory = useCallback(async (storyId: string) => {
    try {
      await storiesService.markAsViewed(storyId);
      // Update local state optimistically
      setStoryGroups(prev => prev.map(group => ({
        ...group,
        stories: group.stories.map(s => 
          s.id === storyId ? { ...s, isViewed: true } : s
        ),
        hasUnviewed: group.stories.some(s => s.id !== storyId && !s.isViewed)
      })));
    } catch (err) {
      console.error('Failed to mark story as viewed:', err);
    }
  }, []);

  const createStory = useCallback(async (data: CreateStoryData) => {
    setIsLoading(true);
    try {
      const newStory = await storiesService.createStory(data);
      await loadStories();
      return newStory;
    } catch (err) {
      console.error('Failed to create story:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadStories]);

  const reactToStory = useCallback(async (storyId: string, emoji: string, message?: string) => {
    try {
      await storiesService.reactToStory(storyId, emoji, message);
    } catch (err) {
      console.error('Failed to react to story:', err);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  return {
    storyGroups,
    isLoading,
    error,
    viewStory,
    createStory,
    reactToStory,
    refreshStories: loadStories,
  };
};
