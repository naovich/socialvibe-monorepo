import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, userId?: string) {
    if (!query || query.length < 2) {
      return { users: [], posts: [] };
    }

    const searchTerm = query.toLowerCase();

    // Search users
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { username: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
      take: 10,
    });

    // Search posts
    const posts = await this.prisma.post.findMany({
      where: {
        caption: { contains: searchTerm, mode: 'insensitive' },
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
        _count: {
          select: { likes: true, comments: true },
        },
      },
      take: 10,
    });

    return {
      users,
      posts: posts.map((post) => ({
        ...post,
        isLiked: false, // TODO: Check if current user liked
      })),
    };
  }
}
