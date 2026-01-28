import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { LikesService } from "./likes.service";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";

@Controller("likes")
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post(":postId")
  @UseGuards(JwtGuard)
  toggleLike(@GetUser("id") userId: string, @Param("postId") postId: string) {
    return this.likesService.toggleLike(userId, postId);
  }

  @Get("post/:postId")
  getLikesByPost(@Param("postId") postId: string) {
    return this.likesService.getLikesByPost(postId);
  }
}
