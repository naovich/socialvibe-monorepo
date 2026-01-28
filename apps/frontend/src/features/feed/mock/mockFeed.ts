import type { Post } from '../types/feed.types';

export const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Sarah Wilson',
      username: 'sarah_w',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    caption: 'Beautiful sunset today! 🌅 #photography #nature',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    vibeTag: '😊',
    location: 'Paris, France',
    privacy: 'public',
    likes: 142,
    comments: [],
    shares: 12,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Alex Thompson',
      username: 'alex_t',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    caption: 'What\'s your favorite coding language? 💻',
    poll: {
      question: 'Favorite programming language?',
      options: [
        { id: 'opt1', text: 'JavaScript', votes: 45 },
        { id: 'opt2', text: 'Python', votes: 38 },
        { id: 'opt3', text: 'TypeScript', votes: 67 },
        { id: 'opt4', text: 'Go', votes: 22 },
      ],
      totalVotes: 172,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    vibeTag: '🤓',
    privacy: 'public',
    likes: 89,
    comments: [],
    shares: 5,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Emma Johnson',
      username: 'emma_j',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    caption: 'Just finished my first marathon! 🏃‍♀️ Never give up on your dreams! 💪',
    images: [
      'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
      'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    ],
    vibeTag: '💪',
    location: 'New York, USA',
    privacy: 'public',
    likes: 324,
    comments: [],
    shares: 28,
    isLiked: false,
    isSaved: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Michael Chen',
      username: 'michael_c',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    caption: 'Coffee ☕ + Code 💻 = Perfect morning',
    images: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
    ],
    vibeTag: '☕',
    privacy: 'friends',
    likes: 56,
    comments: [],
    shares: 3,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: 'Lisa Anderson',
      username: 'lisa_a',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    },
    caption: 'New project launch! 🚀 Check out what we\'ve been working on #startup #tech',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    vibeTag: '🚀',
    location: 'San Francisco, USA',
    privacy: 'public',
    likes: 215,
    comments: [],
    shares: 42,
    isLiked: true,
    isSaved: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const generateMorePosts = (page: number, count: number = 10): Post[] => {
  const templates = mockPosts;
  const newPosts: Post[] = [];

  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const id = `post-${page}-${i}`;
    
    newPosts.push({
      ...template,
      id,
      author: {
        ...template.author,
        id: `user-${page}-${i}`,
      },
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.7,
      isSaved: Math.random() > 0.8,
      createdAt: new Date(Date.now() - (page * count + i) * 60 * 60 * 1000).toISOString(),
    });
  }

  return newPosts;
};
