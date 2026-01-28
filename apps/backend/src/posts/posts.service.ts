import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId,
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

  async findAll(page: number = 1, limit: number = 20, userId?: string) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          comments: {
            take: 3, // Only load first 3 comments
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
            orderBy: { createdAt: 'desc' },
          },
          likes: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : false,
          _count: {
            select: { likes: true, comments: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count(),
    ]);

    // Add isLiked field
    const postsWithLiked = posts.map((post) => ({
      ...post,
      isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
      likes: undefined, // Remove likes array, only keep count
    }));

    return {
      posts: postsWithLiked,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
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
          orderBy: { createdAt: 'desc' },
        },
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : false,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      ...post,
      isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
      likes: undefined,
    };
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { ...dto },
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

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { message: 'Post deleted successfully' };
  }

  async toggleLike(userId: string, postId: string) {
    // Check if post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return { liked: true };
    }
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { authorId: userId },
        skip,
        take: limit,
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({ where: { authorId: userId } }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    };
  }
}
