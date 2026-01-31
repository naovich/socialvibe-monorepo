import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags("comments")
@ApiBearerAuth()
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post("posts/:postId")
  @ApiOperation({ summary: "Add comment to post" })
  @ApiResponse({ status: 201, description: "Comment created successfully" })
  @ApiResponse({ status: 404, description: "Post not found" })
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: AuthenticatedRequest,
    @Param("postId") postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user.id, postId, createCommentDto);
  }

  @Get("posts/:postId")
  @ApiOperation({ summary: "Get comments for post" })
  @ApiResponse({ status: 200, description: "Returns post comments" })
  @UseGuards(JwtAuthGuard)
  findAll(@Param("postId") postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({ status: 200, description: "Comment deleted successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - not comment author" })
  @UseGuards(JwtAuthGuard)
  remove(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.commentsService.remove(req.user.id, id);
  }
}
