import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";

@Controller("comments")
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post(":postId")
  @UseGuards(JwtGuard)
  create(
    @GetUser("id") userId: string,
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, postId, dto);
  }

  @Get("post/:postId")
  findByPost(@Param("postId") postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  delete(@GetUser("id") userId: string, @Param("id") commentId: string) {
    return this.commentsService.delete(userId, commentId);
  }
}
