import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {VerifyEmailDto} from "./dto/verify-email.dto";
import {UserLoginDto} from "./dto/user-login.dto";
import {IUserInfo} from "./UserInfo";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async login(@Body() dto : UserLoginDto) : Promise<void> {
    const {email, password} = dto

     await this.usersService.login(email, password)
  }

  @Get("/:id")
  async getUserInfo(@Param('id') userId : string) : Promise<void> {
     await this.usersService.getUserInfoById(userId)
  }
}
