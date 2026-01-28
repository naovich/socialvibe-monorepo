import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./dto";

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

  async findAll() {
    return this.prisma.post.findMany({
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
          orderBy: { createdAt: "desc" },
        },
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
        likes: true,
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
  }

  async update(userId: string, postId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { ...dto },
    });
  }

  async delete(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.authorId !== userId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.post.delete({
      where: { id: postId },
    });
  }

  async toggleLike(userId: string, postId: string) {
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
}
