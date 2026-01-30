import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: { name: string; description?: string; avatar?: string; coverImage?: string; isPrivate?: boolean }) {
    return this.prisma.group.create({
      data: {
        ...data,
        creatorId: userId,
        members: {
          connect: { id: userId }, // Creator is automatically a member
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string) {
    const groups = await this.prisma.group.findMany({
      where: userId
        ? {
            OR: [
              { isPrivate: false },
              { members: { some: { id: userId } } },
            ],
          }
        : { isPrivate: false },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add isMember field if userId provided
    if (userId) {
      // PERFORMANCE FIX: Get all user's memberships in 1 query instead of N queries
      const userMemberships = await this.prisma.group.findMany({
        where: {
          id: { in: groups.map(g => g.id) },
          members: { some: { id: userId } },
        },
        select: { id: true },
      });

      const membershipSet = new Set(userMemberships.map(g => g.id));

      return groups.map((group) => ({
        ...group,
        isMember: membershipSet.has(group.id),
        membersCount: group._count.members,
        postsCount: group._count.posts,
      }));
    }

    return groups.map((g) => ({
      ...g,
      membersCount: g._count.members,
      postsCount: g._count.posts,
    }));
  }

  async findOne(groupId: string, userId?: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
          take: 20,
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // Check if user is member
    const isMember = userId
      ? group.members.some((m) => m.id === userId)
      : false;

    // If private group and user is not member, deny access
    if (group.isPrivate && !isMember) {
      throw new ForbiddenException('This group is private');
    }

    return {
      ...group,
      isMember,
      membersCount: group._count.members,
      postsCount: group._count.posts,
    };
  }

  async getMembers(groupId: string, userId?: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { isPrivate: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // If private, check membership
    if (group.isPrivate && userId) {
      const isMember = await this.prisma.group.findFirst({
        where: {
          id: groupId,
          members: { some: { id: userId } },
        },
      });

      if (!isMember) {
        throw new ForbiddenException('This group is private');
      }
    }

    return this.prisma.group
      .findUnique({
        where: { id: groupId },
      })
      .members({
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
        },
      });
  }

  async join(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { where: { id: userId } },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.members.length > 0) {
      throw new BadRequestException('Already a member of this group');
    }

    if (group.isPrivate) {
      throw new ForbiddenException('Cannot join private group');
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });

    return { message: 'Joined group successfully' };
  }

  async leave(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { where: { id: userId } },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.members.length === 0) {
      throw new BadRequestException('Not a member of this group');
    }

    if (group.creatorId === userId) {
      throw new BadRequestException('Creator cannot leave the group. Delete it instead.');
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          disconnect: { id: userId },
        },
      },
    });

    return { message: 'Left group successfully' };
  }

  async update(userId: string, groupId: string, data: { name?: string; description?: string; avatar?: string; coverImage?: string; isPrivate?: boolean }) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.creatorId !== userId) {
      throw new ForbiddenException('Only group creator can update the group');
    }

    return this.prisma.group.update({
      where: { id: groupId },
      data,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });
  }

  async delete(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.creatorId !== userId) {
      throw new ForbiddenException('Only group creator can delete the group');
    }

    await this.prisma.group.delete({
      where: { id: groupId },
    });

    return { message: 'Group deleted successfully' };
  }

  async getPosts(groupId: string, userId?: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { isPrivate: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    // If private, check membership
    if (group.isPrivate && userId) {
      const isMember = await this.prisma.group.findFirst({
        where: {
          id: groupId,
          members: { some: { id: userId } },
        },
      });

      if (!isMember) {
        throw new ForbiddenException('This group is private');
      }
    }

    return this.prisma.post.findMany({
      where: { groupId },
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
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
