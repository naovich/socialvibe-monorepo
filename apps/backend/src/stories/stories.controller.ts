import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { StoriesService } from "./stories.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request.interface";

@Controller("stories")
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() data: { image?: string; video?: string },
  ) {
    return this.storiesService.create(req.user.id, data);
  }

  @Get()
  getActive() {
    return this.storiesService.getActive();
  }

  @Get("user/:userId")
  getUserStories(@Param("userId") userId: string) {
    return this.storiesService.getUserStories(userId);
  }

  @Delete(":id")
  delete(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.storiesService.delete(req.user.id, id);
  }
}
