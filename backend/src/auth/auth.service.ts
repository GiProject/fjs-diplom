import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {User} from "../users/user.model";

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
      private jwtService: JwtService
  ) {
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValidate = await bcrypt.compare(password, user.passwordHash);

    if (isPasswordValidate) {
      return {
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        role: user.role
      };
    }

    return null;
  }

  async login (user: User) {
    const payload = {username: user.name, sub: user._id};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}