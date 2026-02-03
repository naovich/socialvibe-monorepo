import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { PostsService } from "./posts.service";
import { CreatePostDto, UpdatePostDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request.interface";

@ApiTags("posts")
@ApiBearerAuth()
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new post" })
  @ApiResponse({ status: 201, description: "Post created successfully" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  @ApiOperation({ summary: "Get feed posts (paginated)" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: "Returns paginated posts" })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postsService.findAll(page || 1, limit || 20, req.user.id);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get posts by user ID" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 20 })
  @ApiResponse({ status: 200, description: "Returns user posts" })
  @UseGuards(JwtAuthGuard)
  getUserPosts(
    @Param("userId") userId: string,
    @Query("page", new ParseIntPipe({ optional: true })) page?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postsService.getUserPosts(userId, page || 1, limit || 20);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get single post by ID" })
  @ApiResponse({ status: 200, description: "Returns post details" })
  @ApiResponse({ status: 404, description: "Post not found" })
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.postsService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update post" })
  @ApiResponse({ status: 200, description: "Post updated successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - not post author" })
  @ApiResponse({ status: 404, description: "Post not found" })
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(req.user.id, id, updatePostDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete post" })
  @ApiResponse({ status: 200, description: "Post deleted successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - not post author" })
  @ApiResponse({ status: 404, description: "Post not found" })
  @UseGuards(JwtAuthGuard)
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.postsService.delete(req.user.id, id);
  }

  @Post(":id/like")
  @ApiOperation({ summary: "Toggle like on post" })
  @ApiResponse({ status: 200, description: "Like toggled successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  @UseGuards(JwtAuthGuard)
  toggleLike(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.postsService.toggleLike(req.user.id, id);
  }
}
