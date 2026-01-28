import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

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
      // Unlike
      await this.prisma.like.delete({ where: { id: existingLike.id } });
      return { message: "Post unliked", liked: false };
    } else {
      // Like
      await this.prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
      return { message: "Post liked", liked: true };
    }
  }

  async getLikesByPost(postId: string) {
    return this.prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });
  }
}
