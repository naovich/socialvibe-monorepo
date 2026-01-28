import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user.id, postId, createCommentDto);
  }

  @Get()
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }
}

@Controller('comments')
export class CommentsSingleController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.commentsService.remove(req.user.id, id);
  }
}
