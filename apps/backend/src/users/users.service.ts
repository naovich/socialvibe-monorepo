import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        // email: true, // SECURITY: Email not exposed publicly
        name: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            friends: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        // email: true, // SECURITY: Email not exposed publicly
        name: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            friends: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    // Check if username is taken (if changing)
    if (updateUserDto.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException("Username already taken");
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        coverImage: true,
        bio: true,
        createdAt: true,
      },
    });

    return user;
  }

  async search(query: string, limit: number = 20) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
      },
    });

    return users;
  }

  async toggleFollow(userId: string, targetUserId: string) {
    if (userId === targetUserId) {
      throw new ConflictException("Cannot follow yourself");
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    // Check if already following
    const existingFriendship = await this.prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId,
          friendId: targetUserId,
        },
      },
    });

    if (existingFriendship) {
      // Unfollow
      await this.prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });
      return { following: false };
    } else {
      // Follow
      await this.prisma.friendship.create({
        data: {
          userId,
          friendId: targetUserId,
          status: "ACCEPTED", // Auto-accept for now (can be PENDING for requests)
        },
      });
      return { following: true };
    }
  }

  async getFollowers(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: "ACCEPTED",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return friendships.map((f) => f.user);
  }

  async getFollowing(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        userId,
        status: "ACCEPTED",
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return friendships.map((f) => f.friend);
  }
}
