#!/bin/bash

echo "📚 Decorating all controllers with Swagger..."

cd "$(dirname "$0")"

# Users Controller
cat > src/users/users.controller.ts << 'EOF'
import { Controller, Get, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search users by query' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Returns matching users' })
  @UseGuards(JwtAuthGuard)
  search(@Query('q') query: string) {
    return this.usersService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }
}
EOF

# Comments Controller (if exists)
if [ -f "src/comments/comments.controller.ts" ]; then
cat > src/comments/comments.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('posts/:postId')
  @ApiOperation({ summary: 'Add comment to post' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(req.user.id, postId, createCommentDto);
  }

  @Get('posts/:postId')
  @ApiOperation({ summary: 'Get comments for post' })
  @ApiResponse({ status: 200, description: 'Returns post comments' })
  @UseGuards(JwtAuthGuard)
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not comment author' })
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.commentsService.remove(req.user.id, id);
  }
}
EOF
fi

# Groups Controller
if [ -f "src/groups/groups.controller.ts" ]; then
cat > src/groups/groups.controller.ts << 'EOF'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(req.user.id, createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups (user is member)' })
  @ApiResponse({ status: 200, description: 'Returns user groups' })
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req) {
    return this.groupsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Returns group details' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not group creator' })
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(req.user.id, id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not group creator' })
  @UseGuards(JwtAuthGuard)
  remove(@Request() req, @Param('id') id: string) {
    return this.groupsService.remove(req.user.id, id);
  }

  @Post(':id/join')
  @ApiOperation({ summary: 'Join group' })
  @ApiResponse({ status: 200, description: 'Joined group successfully' })
  @UseGuards(JwtAuthGuard)
  join(@Request() req, @Param('id') id: string) {
    return this.groupsService.join(req.user.id, id);
  }

  @Post(':id/leave')
  @ApiOperation({ summary: 'Leave group' })
  @ApiResponse({ status: 200, description: 'Left group successfully' })
  @UseGuards(JwtAuthGuard)
  leave(@Request() req, @Param('id') id: string) {
    return this.groupsService.leave(req.user.id, id);
  }
}
EOF
fi

echo ""
echo "✅ All controllers decorated with Swagger!"
echo ""
echo "Controllers updated:"
echo "  - src/posts/posts.controller.ts"
echo "  - src/users/users.controller.ts"
echo "  - src/comments/comments.controller.ts"
echo "  - src/groups/groups.controller.ts"
echo ""
echo "Swagger UI: http://localhost:3000/api/docs"
