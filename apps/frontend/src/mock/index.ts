import { mockUsers } from './users';
import { mockPosts } from './posts';
import { mockStories } from './stories';
import { mockNotifications } from './notifications';
import { mockComments } from './comments';
import * as helpers from './helpers';

export const mock = {
  users: mockUsers,
  posts: mockPosts,
  stories: mockStories,
  notifications: mockNotifications,
  comments: mockComments,
  helpers,
};

export * from './users';
export * from './posts';
export * from './stories';
export * from './notifications';
export * from './comments';
export * from './helpers';
