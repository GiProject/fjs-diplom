import { Body, Controller, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, SearchUserInputParams, SearchUserParams } from "./user.interfaces";
import { UserDocument } from "./user.model";
import { Roles } from "../guards/role.decorator";
import { AuthenticatedGuard } from "../guards/authentication.guard";
import { RoleGuard } from "../guards/role.guard";

@Controller("api/users")
export class UsersController {
  constructor(private userService: UsersService) {
  }

  @Get()
  @Roles('manager')
  @UseGuards(AuthenticatedGuard, RoleGuard)
  async findAll(@Query() query: SearchUserInputParams) {
    const params: SearchUserParams = {
      ...query,
      email: query.query,
      name: query.query,
      contactPhone: query.query
    };
    
    return await this.userService.findAll(params);
  }

}