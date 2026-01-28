export const mockStories = {
  stories: [
    {
      id: 'story1',
      userId: 'user1',
      user: {
        name: 'Sarah',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200',
      viewed: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      expiresAt: new Date(Date.now() + 84600000).toISOString(),
    },
    {
      id: 'story2',
      userId: 'user2',
      user: {
        name: 'Alex',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      image: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=200',
      viewed: true,
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      expiresAt: new Date(Date.now() + 79200000).toISOString(),
    },
    {
      id: 'story3',
      userId: 'user3',
      user: {
        name: 'Elena',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      },
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
      viewed: false,
      createdAt: new Date(Date.now() - 900000).toISOString(),
      expiresAt: new Date(Date.now() + 82800000).toISOString(),
    },
    {
      id: 'story4',
      userId: 'user4',
      user: {
        name: 'Marcus',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      },
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
      viewed: false,
      createdAt: new Date(Date.now() - 2700000).toISOString(),
      expiresAt: new Date(Date.now() + 81900000).toISOString(),
    },
  ],
};
