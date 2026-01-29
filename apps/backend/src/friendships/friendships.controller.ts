import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('friendships')
@UseGuards(JwtAuthGuard)
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post('request/:friendId')
  sendRequest(@Request() req, @Param('friendId') friendId: string) {
    return this.friendshipsService.sendRequest(req.user.id, friendId);
  }

  @Post('accept/:friendshipId')
  acceptRequest(@Request() req, @Param('friendshipId') friendshipId: string) {
    return this.friendshipsService.acceptRequest(req.user.id, friendshipId);
  }

  @Delete('reject/:friendshipId')
  rejectRequest(@Request() req, @Param('friendshipId') friendshipId: string) {
    return this.friendshipsService.rejectRequest(req.user.id, friendshipId);
  }

  @Delete('remove/:friendId')
  removeFriend(@Request() req, @Param('friendId') friendId: string) {
    return this.friendshipsService.removeFriend(req.user.id, friendId);
  }

  @Get('friends')
  getFriends(@Request() req) {
    return this.friendshipsService.getFriends(req.user.id);
  }

  @Get('pending')
  getPendingRequests(@Request() req) {
    return this.friendshipsService.getPendingRequests(req.user.id);
  }
}
