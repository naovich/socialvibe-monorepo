import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll(@Request() req) {
    const userId = req.user?.id;
    return this.groupsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.groupsService.findOne(id, userId);
  }

  @Get(':id/members')
  getMembers(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.groupsService.getMembers(id, userId);
  }

  @Get(':id/posts')
  getPosts(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.groupsService.getPosts(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createGroupDto: any) {
    return this.groupsService.create(req.user.id, createGroupDto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  join(@Request() req, @Param('id') id: string) {
    return this.groupsService.join(req.user.id, id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  leave(@Request() req, @Param('id') id: string) {
    return this.groupsService.leave(req.user.id, id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Request() req, @Param('id') id: string, @Body() updateGroupDto: any) {
    return this.groupsService.update(req.user.id, id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Request() req, @Param('id') id: string) {
    return this.groupsService.delete(req.user.id, id);
  }
}
