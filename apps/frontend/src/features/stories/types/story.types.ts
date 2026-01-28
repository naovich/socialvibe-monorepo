export interface Story {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  };
  text?: string;
  textPosition?: 'top' | 'center' | 'bottom';
  textStyle?: {
    color: string;
    backgroundColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
  duration: number; // seconds
  views: StoryView[];
  reactions: StoryReaction[];
  isViewed: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface StoryView {
  userId: string;
  viewedAt: string;
}

export interface StoryReaction {
  userId: string;
  emoji: string;
  message?: string;
  createdAt: string;
}

export interface StoryGroup {
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  stories: Story[];
  hasUnviewed: boolean;
}

export interface CreateStoryData {
  media: File;
  text?: string;
  textPosition?: 'top' | 'center' | 'bottom';
  textStyle?: {
    color: string;
    backgroundColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
  };
  duration?: number;
}

export interface StoriesState {
  storyGroups: StoryGroup[];
  activeStory: Story | null;
  activeGroupIndex: number;
  activeStoryIndex: number;
  isLoading: boolean;
  error: string | null;
}
