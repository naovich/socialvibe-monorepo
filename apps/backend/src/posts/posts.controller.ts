import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";

@Controller("posts")
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@GetUser("id") userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtGuard)
  update(
    @GetUser("id") userId: string,
    @Param("id") postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(userId, postId, dto);
  }

  @Delete(":id")
  @UseGuards(JwtGuard)
  delete(@GetUser("id") userId: string, @Param("id") postId: string) {
    return this.postsService.delete(userId, postId);
  }

  @Post(":id/like")
  @UseGuards(JwtGuard)
  toggleLike(@GetUser("id") userId: string, @Param("id") postId: string) {
    return this.postsService.toggleLike(userId, postId);
  }
}
