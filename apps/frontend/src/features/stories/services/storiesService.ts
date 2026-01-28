import type { Story, StoryGroup, CreateStoryData } from '../types/story.types';
import { mockStoryGroups } from '../mock/mockStories';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class StoriesService {
  private storyGroups: StoryGroup[] = [...mockStoryGroups];

  async getStoryGroups(): Promise<StoryGroup[]> {
    await delay(300);
    return this.storyGroups.filter(g => g.stories.length > 0);
  }

  async markAsViewed(storyId: string): Promise<void> {
    await delay(100);

    this.storyGroups.forEach(group => {
      group.stories.forEach(story => {
        if (story.id === storyId && !story.isViewed) {
          story.isViewed = true;
          story.views.push({
            userId: 'current-user',
            viewedAt: new Date().toISOString(),
          });
        }
      });

      // Update hasUnviewed
      group.hasUnviewed = group.stories.some(s => !s.isViewed);
    });
  }

  async createStory(data: CreateStoryData): Promise<Story> {
    await delay(800);

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: 'current-user',
      user: {
        id: 'current-user',
        name: 'You',
        username: 'you',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      },
      media: {
        type: data.media.type.startsWith('video') ? 'video' : 'image',
        url: URL.createObjectURL(data.media),
      },
      text: data.text,
      textPosition: data.textPosition || 'bottom',
      textStyle: data.textStyle,
      duration: data.duration || 5,
      views: [],
      reactions: [],
      isViewed: false,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Find or create user's story group
    let userGroup = this.storyGroups.find(g => g.userId === 'current-user');
    if (!userGroup) {
      userGroup = {
        userId: 'current-user',
        user: newStory.user,
        stories: [],
        hasUnviewed: false,
      };
      this.storyGroups.unshift(userGroup);
    }

    userGroup.stories.push(newStory);
    userGroup.hasUnviewed = true;

    return newStory;
  }

  async deleteStory(storyId: string): Promise<void> {
    await delay(300);

    this.storyGroups.forEach(group => {
      group.stories = group.stories.filter(s => s.id !== storyId);
    });

    // Remove empty groups
    this.storyGroups = this.storyGroups.filter(g => g.stories.length > 0);
  }

  async reactToStory(storyId: string, emoji: string, message?: string): Promise<void> {
    await delay(200);

    this.storyGroups.forEach(group => {
      group.stories.forEach(story => {
        if (story.id === storyId) {
          const existingReaction = story.reactions.find(r => r.userId === 'current-user');
          
          if (existingReaction) {
            existingReaction.emoji = emoji;
            existingReaction.message = message;
          } else {
            story.reactions.push({
              userId: 'current-user',
              emoji,
              message,
              createdAt: new Date().toISOString(),
            });
          }
        }
      });
    });
  }
}

export const storiesService = new StoriesService();
