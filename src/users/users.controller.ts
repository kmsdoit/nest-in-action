import {Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers, UseGuards} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {IUserInfo} from "./UserInfo";
import {AuthService} from "../auth/auth.service";
import {AuthGuard} from "../utils/guard/auth.guard";

@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly authService : AuthService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto
    await this.usersService.createUser(name, email, password)
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto : VerifyEmailDto) {
    const { signupVerifyToken } = dto
    await this.usersService.verifyEmail(signupVerifyToken)
  }

  @Post('/login')
  async login(@Body() dto : UserLoginDto) : Promise<string> {
    const {email, password} = dto

     return await this.usersService.login(email, password)
  }

  @UseGuards(AuthGuard)
  @Get("/:id")
  async getUserInfo(@Headers() headers : any, @Param('id') userId : string) : Promise<IUserInfo> {
      return await this.usersService.getUserInfoById(userId)
  }
}
