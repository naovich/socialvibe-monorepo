import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { image?: string; video?: string }) {
    if (!data.image && !data.video) {
      throw new Error('Story must have either image or video');
    }

    // Stories expire after 24 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return this.prisma.story.create({
      data: {
        authorId: userId,
        image: data.image || '',
        video: data.video,
        expiresAt,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async getActive() {
    const now = new Date();

    const stories = await this.prisma.story.findMany({
      where: {
        expiresAt: {
          gt: now,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by author (latest story per user)
    const grouped = new Map<string, any>();
    
    for (const story of stories) {
      if (!grouped.has(story.authorId)) {
        grouped.set(story.authorId, {
          userId: story.authorId,
          user: story.author,
          stories: [story],
          latestStory: story,
        });
      } else {
        grouped.get(story.authorId)!.stories.push(story);
      }
    }

    return Array.from(grouped.values());
  }

  async getUserStories(userId: string) {
    const now = new Date();

    return this.prisma.story.findMany({
      where: {
        authorId: userId,
        expiresAt: {
          gt: now,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(userId: string, storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    if (story.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own stories');
    }

    await this.prisma.story.delete({
      where: { id: storyId },
    });

    return { message: 'Story deleted successfully' };
  }

  // Clean up expired stories (run periodically via cron)
  async cleanupExpired() {
    const now = new Date();

    const result = await this.prisma.story.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    return { deleted: result.count };
  }
}
