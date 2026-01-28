import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  search(@Query('q') query: string, @Query('limit') limit?: string) {
    return this.usersService.search(query, limit ? parseInt(limit) : 20);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Users can only update their own profile
    if (req.user.id !== id) {
      throw new Error('Forbidden');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  toggleFollow(@Request() req, @Param('id') targetUserId: string) {
    return this.usersService.toggleFollow(req.user.id, targetUserId);
  }

  @Get(':id/followers')
  @UseGuards(JwtAuthGuard)
  getFollowers(@Param('id') userId: string) {
    return this.usersService.getFollowers(userId);
  }

  @Get(':id/following')
  @UseGuards(JwtAuthGuard)
  getFollowing(@Param('id') userId: string) {
    return this.usersService.getFollowing(userId);
  }
}
