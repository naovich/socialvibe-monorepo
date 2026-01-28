import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";
import type { User } from "@prisma/client";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get("me")
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":username")
  findByUsername(@Param("username") username: string) {
    return this.usersService.findByUsername(username);
  }
}
