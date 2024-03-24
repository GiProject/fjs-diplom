import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    // Response,
    // HttpStatus,
    // BadRequestException,
    UseFilters, Get,
} from '@nestjs/common';
// import {deleteCookie} from 'cookies-next';
import {UsersService} from '../users/users.service';
import * as bcrypt from 'bcrypt';
// import {HttpExceptionFilter} from 'src/HttpExceptionFilter/HttpExceptionFilter ';
// import {Roles} from '../guards/role.decorator';
// import {RoleGuard} from '../guards/role.guard';
import {LocalAuthGuard} from '../guards/local-auth.guard';
// import {AuthenticatedGuard} from '../guards/authentication.guard';
// import ISearchUserParams from '../interface/user/ISearchUserParams';
import * as mongoose from 'mongoose';
import {IUserRegistration} from "../users/user.interfaces";
import {AuthGuard} from "@nestjs/passport";
import { json } from "express";

interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
    password: string;
    name: string;
    contactPhone: string;
    role: string;
}

@Controller('api')
export class AuthController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get('/test')
    async test() {
        return 'test';
    }

    @UseGuards(LocalAuthGuard)
    @Post('/users/login')
    async login(@Request() req) {
        //return req.user;
    }

    @Post('/users/signup')
    async signup(@Body() userRegistration: IUserRegistration) {
        ///return await this.usersService.create(userRegistration);
    }

    @UseGuards(AuthGuard)
    @Post('/signin')
    async signin(@Request() req) {
        console.log(req.body);
        return req.user;
    }

    // @Roles('admin')
    // @UseGuards(AuthenticatedGuard, RoleGuard)
    // @Post('/admin/users-create')
    // async signupAdmin(@Body() CreateUserDto: ICreateUserDto) {
    //     const {password} = CreateUserDto;
    //     try {
    //         const hashPassword = await bcrypt.hash(
    //             password,
    //             Number(process.env.SALT),
    //         );
    //
    //         const user: IUser = await this.usersService.create({
    //             ...CreateUserDto,
    //             password: hashPassword,
    //         });
    //         const {_id, email, name, contactPhone, role} = user;
    //
    //         return {
    //             id: _id.toString(),
    //             email: email,
    //             name: name,
    //             contactPhone: contactPhone,
    //             role: role,
    //         };
    //     } catch (e) {
    //         throw new BadRequestException({
    //             status: HttpStatus.BAD_REQUEST,
    //             error: 'Данный еmail уже занят',
    //         });
    //     }
    // }
    //
    // @UseGuards(AuthenticatedGuard)
    // @Post('/auth/logout')
    // async logout(@Request() req, @Response() res) {
    //     req.logout(function (err) {
    //         if (err) {
    //             console.log(err);
    //             return err;
    //         }
    //     });
    //     deleteCookie('connect.sid', {
    //         req,
    //         res,
    //     });
    // }
    //
    // @Roles('admin')
    // @UseGuards(AuthenticatedGuard, RoleGuard)
    // @Post('/admin/users/')
    // async searchAdmin(@Body() SearchUserParams: ISearchUserParams) {
    //     try {
    //         const search = await this.usersService.findAll(SearchUserParams);
    //         return search.map((item) => ({
    //             id: item._doc._id.toString(),
    //             email: item._doc.email,
    //             name: item._doc.name,
    //             contactPhone: item._doc.contactPhone,
    //         }));
    //     } catch (e) {
    //         return e;
    //     }
    // }
    //
    // @Roles('manager')
    // @UseGuards(AuthenticatedGuard, RoleGuard)
    // @Post('/manager/users/')
    // async searchManager(@Body() SearchUserParams: ISearchUserParams) {
    //     try {
    //         const search = await this.usersService.findAll(SearchUserParams);
    //         return search.map((item) => ({
    //             id: item._doc._id.toString(),
    //             email: item._doc.email,
    //             name: item._doc.name,
    //             contactPhone: item._doc.contactPhone,
    //         }));
    //     } catch (e) {
    //         return e;
    //     }
    // }
}