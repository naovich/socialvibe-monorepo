import type { Notification } from '../types';

export const mockNotifications: { notifications: Notification[] } = {
  notifications: [
    {
      id: 'notif1',
      type: 'like',
      user: {
        name: 'Sarah Wilson',
        username: 'sarah_w',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      content: 'liked your post',
      postId: 'post1',
      createdAt: new Date(Date.now() - 300000).toISOString(),
      read: false,
    },
    {
      id: 'notif2',
      type: 'comment',
      user: {
        name: 'Alex Thompson',
        username: 'alex_t',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      content: "commented: 'This is amazing!' on your post",
      postId: 'post1',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      read: true,
    },
    {
      id: 'notif3',
      type: 'follow',
      user: {
        name: 'Elena Rodriguez',
        username: 'elena_r',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      },
      content: 'started following you',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: 'notif4',
      type: 'mention',
      user: {
        name: 'Marcus Chen',
        username: 'marcus_c',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      },
      content: 'mentioned you in a comment',
      postId: 'post2',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: 'notif5',
      type: 'badge',
      user: {
        name: 'SocialVibe',
        username: 'socialvibe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SocialVibe',
      },
      content: "You earned the 'Early Adopter' badge! 🏆",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
  ],
};
