import type { Comment } from '../types/comment.types';

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
    id: 'current-user',
    name: 'You',
    username: 'you',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
  },
];

export const mockComments: Record<string, Comment[]> = {
  'post1': [
    {
      id: 'comment1',
      postId: 'post1',
      userId: 'user1',
      user: users[0],
      content: 'Amazing photo! Where is this?',
      parentId: null,
      replies: [
        {
          id: 'comment1-1',
          postId: 'post1',
          userId: 'current-user',
          user: users[3],
          content: 'Thanks! This is in Iceland 🇮🇸',
          parentId: 'comment1',
          replies: [
            {
              id: 'comment1-1-1',
              postId: 'post1',
              userId: 'user1',
              user: users[0],
              content: 'Wow, adding it to my bucket list!',
              parentId: 'comment1-1',
              replies: [],
              likes: 2,
              isLiked: false,
              createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            },
          ],
          likes: 5,
          isLiked: true,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
      ],
      likes: 12,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'comment2',
      postId: 'post1',
      userId: 'user2',
      user: users[1],
      content: 'Incredible shot! 📸',
      parentId: null,
      replies: [],
      likes: 8,
      isLiked: true,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ],
};
