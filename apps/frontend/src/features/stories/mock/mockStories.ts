import type { Story, StoryGroup } from '../types/story.types';

const users = [
  {
    id: 'user1',
    name: 'Sarah Wilson',
    username: 'sarah_w',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 'user2',
    name: 'Alex Thompson',
    username: 'alex_t',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: 'user3',
    name: 'Emma Johnson',
    username: 'emma_j',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
  },
  {
    id: 'user4',
    name: 'Michael Chen',
    username: 'michael_c',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
  {
    id: 'user5',
    name: 'Lisa Anderson',
    username: 'lisa_a',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
];

const stories: Story[] = [
  // Sarah's stories
  {
    id: 'story1-1',
    userId: 'user1',
    user: users[0],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080',
    },
    text: '🌄 Mountain vibes',
    textPosition: 'bottom',
    textStyle: {
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      fontSize: 'medium',
    },
    duration: 5,
    views: [
      { userId: 'current-user', viewedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    ],
    reactions: [],
    isViewed: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'story1-2',
    userId: 'user1',
    user: users[0],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080',
    },
    text: 'Best day ever! ✨',
    textPosition: 'top',
    textStyle: {
      color: '#ffffff',
      backgroundColor: 'rgba(0, 150, 57, 0.8)',
      fontSize: 'large',
    },
    duration: 5,
    views: [],
    reactions: [],
    isViewed: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
  },

  // Alex's story
  {
    id: 'story2-1',
    userId: 'user2',
    user: users[1],
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080',
    },
    text: 'Coding session 💻',
    textPosition: 'center',
    textStyle: {
      color: '#009639',
      fontSize: 'large',
    },
    duration: 5,
    views: [],
    reactions: [],
    isViewed: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 23.5 * 60 * 60 * 1000).toISOString(),
  },
];

// Group stories by user
export const mockStoryGroups: StoryGroup[] = users.map((user) => {
  const userStories = stories.filter((s) => s.userId === user.id);
  const hasUnviewed = userStories.some((s) => !s.isViewed);

  return {
    userId: user.id,
    user,
    stories: userStories,
    hasUnviewed,
  };
}).filter((group) => group.stories.length > 0);
