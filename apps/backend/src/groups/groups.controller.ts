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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { GroupsService } from "./groups.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "../common/interfaces/authenticated-request.interface";

interface GroupDto {
  name: string;
  description?: string;
  avatar?: string;
  coverImage?: string;
  isPrivate?: boolean;
}

@ApiTags("groups")
@Controller("groups")
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: "Get all groups (user is member or public)" })
  @ApiResponse({ status: 200, description: "Returns groups list" })
  findAll(@Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.groupsService.findAll(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get group details by ID" })
  @ApiResponse({ status: 200, description: "Returns group details" })
  @ApiResponse({ status: 404, description: "Group not found" })
  findOne(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    const userId = req.user?.id;
    return this.groupsService.findOne(id, userId);
  }

  @Get(":id/members")
  @ApiOperation({ summary: "Get group members" })
  @ApiResponse({ status: 200, description: "Returns members list" })
  getMembers(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    const userId = req.user?.id;
    return this.groupsService.getMembers(id, userId);
  }

  @Get(":id/posts")
  @ApiOperation({ summary: "Get group posts" })
  @ApiResponse({ status: 200, description: "Returns group posts" })
  getPosts(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    const userId = req.user?.id;
    return this.groupsService.getPosts(id, userId);
  }

  @Post()
  @ApiOperation({ summary: "Create a new group" })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: "Group created successfully" })
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createGroupDto: GroupDto,
  ) {
    return this.groupsService.create(req.user.id, createGroupDto);
  }

  @Post(":id/join")
  @ApiOperation({ summary: "Join a group" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Joined group successfully" })
  @UseGuards(JwtAuthGuard)
  join(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.groupsService.join(req.user.id, id);
  }

  @Post(":id/leave")
  @ApiOperation({ summary: "Leave a group" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Left group successfully" })
  @UseGuards(JwtAuthGuard)
  leave(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.groupsService.leave(req.user.id, id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update group details" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Group updated successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - not group creator" })
  @UseGuards(JwtAuthGuard)
  update(
    @Request() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() updateGroupDto: Partial<GroupDto>,
  ) {
    return this.groupsService.update(req.user.id, id, updateGroupDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a group" })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "Group deleted successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - not group creator" })
  @UseGuards(JwtAuthGuard)
  delete(@Request() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.groupsService.delete(req.user.id, id);
  }
}
