export const mockComments = {
  comments: [
    {
      postId: 'post1',
      commentId: 'comment1',
      user: {
        name: 'Alex Thompson',
        username: 'alex_t',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      text: 'This is amazing! Keep up the great work 👍',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      likes: 12,
      isLiked: false,
    },
    {
      postId: 'post1',
      commentId: 'comment2',
      user: {
        name: 'Elena Rodriguez',
        username: 'elena_r',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      },
      text: "Love the vibe! Can't wait to see what you build next 🚀",
      createdAt: new Date(Date.now() - 900000).toISOString(),
      likes: 8,
      isLiked: true,
    },
    {
      postId: 'post2',
      commentId: 'comment3',
      user: {
        name: 'Marcus Chen',
        username: 'marcus_c',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      },
      text: "Best coffee spot in Brooklyn! I've been there too ☕",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 5,
      isLiked: false,
    },
    {
      postId: 'post3',
      commentId: 'comment4',
      user: {
        name: 'Sarah Wilson',
        username: 'sarah_w',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      },
      text: 'Your design work is inspiring! What tools do you use?',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 15,
      isLiked: false,
    },
    {
      postId: 'post3',
      commentId: 'comment5',
      user: {
        name: 'Alex Thompson',
        username: 'alex_t',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      },
      text: 'Figma ftw! 🎯',
      createdAt: new Date(Date.now() - 5400000).toISOString(),
      likes: 3,
      isLiked: false,
    },
  ],
};
