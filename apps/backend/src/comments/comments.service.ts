import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto";

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, postId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        text: dto.text,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });
  }

  async delete(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.authorId !== userId) {
      throw new Error("Access denied");
    }

    await this.prisma.comment.delete({ where: { id: commentId } });
  }
}
