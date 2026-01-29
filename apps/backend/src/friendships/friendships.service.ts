import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendshipsService {
  constructor(private prisma: PrismaService) {}

  async sendRequest(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check if request already exists
    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('Friend request already exists');
    }

    return this.prisma.friendship.create({
      data: {
        userId,
        friendId,
        status: 'PENDING',
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
  }

  async acceptRequest(userId: string, friendshipId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.friendId !== userId) {
      throw new BadRequestException('You can only accept requests sent to you');
    }

    return this.prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'ACCEPTED' },
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
  }

  async rejectRequest(userId: string, friendshipId: string) {
    const friendship = await this.prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.friendId !== userId) {
      throw new BadRequestException('You can only reject requests sent to you');
    }

    await this.prisma.friendship.delete({
      where: { id: friendshipId },
    });

    return { message: 'Friend request rejected' };
  }

  async removeFriend(userId: string, friendId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
        status: 'ACCEPTED',
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    await this.prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return { message: 'Friend removed successfully' };
  }

  async getFriends(userId: string) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId, status: 'ACCEPTED' },
          { friendId: userId, status: 'ACCEPTED' },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    // Map to return the friend (not the current user)
    return friendships.map((f) => {
      const friend = f.userId === userId ? f.friend : f.user;
      return {
        id: friend.id,
        name: friend.name,
        username: friend.username,
        avatar: friend.avatar,
        bio: friend.bio,
      };
    });
  }

  async getPendingRequests(userId: string) {
    const requests = await this.prisma.friendship.findMany({
      where: {
        friendId: userId,
        status: 'PENDING',
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

    return requests.map((r) => ({
      id: r.id,
      user: r.user,
      createdAt: r.createdAt,
    }));
  }
}
