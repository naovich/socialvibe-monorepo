import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorator/get-user.decorator";

interface UserPayload {
  id: string;
  email: string;
}

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @GetUser() user: UserPayload,
    @Query("limit") limit?: string,
  ) {
    return this.notificationsService.getNotifications(
      user.id,
      limit ? parseInt(limit) : 20,
    );
  }

  @Patch(":id/read")
  markAsRead(@Param("id") id: string, @GetUser() user: UserPayload) {
    return this.notificationsService.markAsRead(user.id, id);
  }

  @Patch("read-all")
  markAllAsRead(@GetUser() user: UserPayload) {
    return this.notificationsService.markAllAsRead(user.id);
  }
}
