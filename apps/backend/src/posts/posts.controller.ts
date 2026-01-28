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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req.user.id, createPostDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postsService.findAll(page || 1, limit || 20, req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  getUserPosts(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.postsService.getUserPosts(userId, page || 1, limit || 20);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req, @Param('id') id: string) {
    return this.postsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(req.user.id, id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.postsService.delete(req.user.id, id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Request() req, @Param('id') id: string) {
    return this.postsService.toggleLike(req.user.id, id);
  }
}
