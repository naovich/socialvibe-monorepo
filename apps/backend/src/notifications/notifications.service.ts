import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationType } from "@prisma/client";

export interface CreateNotificationDto {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  content: string;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { recipientId: userId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        recipientId: userId, // Security: only own notifications
      },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: { read: true },
    });
  }

  // Helper to create notifications
  async createNotification(data: CreateNotificationDto) {
    return this.prisma.notification.create({ data });
  }
}
