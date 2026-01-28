import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
        _count: {
          select: {
            posts: true,
            friends: true,
            friendOf: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        posts: {
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
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            posts: true,
            friends: true,
            friendOf: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });
  }
}
