import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {EmailService} from "../email/email.service";
import * as uuid from 'uuid'
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {ulid} from "ulid";
import {AuthService} from "../auth/auth.service";
@Injectable()
export class UsersService {

  constructor(
      private  emailService : EmailService,
      @InjectRepository(User) private userRepository : Repository<User>,
      private  authService : AuthService
  ) {
  }

  async createUser(name : string, email : string, password : string) {
    const userExist = await this.checkUserExist(email)

    if(userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다')
    }

    const signupVerifyToken = uuid.v1()

    await this.savedUser(name, email,password, signupVerifyToken)
    await this.sendMemberJoinMail(email, signupVerifyToken)
  }

  private async checkUserExist(email : string) {
    const user = await this.userRepository.findOne({
      where : {email}
    })

    return user !== undefined
  }

  private async savedUser(name : string, email : string, password: string, signupVerifyToken : string) {
    const user = new User()
    user.id = ulid()
    user.name = name
    user.password = password
    user.email = email
    user.signupVerifyToken = signupVerifyToken
    await this.userRepository.save(user)
  }

  private async sendMemberJoinMail(email : string, signupVerifyToken : string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken)
  }

  async verifyEmail(signupVerifyToken : string) {
    const user = await this.userRepository.findOne({
      where : {
        signupVerifyToken
      }
    })

    if(!user) {
      throw new NotFoundException('유저가 존재하지 않습니다')
    }

    return this.authService.login({
      id : user.id,
      name : user.name,
      email : user.email
    })
  }

  async login(email : string, password : string) {
    const user = await this.userRepository.findOne({
      where : {email , password}
    })

    if(!user) {
      throw new NotFoundException('유저가 존재하지 않습니다')
    }

    return this.authService.login({
      id : user.id,
      email : user.email,
      name : user.name,
    })
  }

  async getUserInfoById(userId : string) {
    const user = await this.userRepository.findOne({
      where : {
        id : userId
      }
    })

    if(!user) {
      throw new NotFoundException('유저가 존재하지 않습니다')
    }

    return {
      id : user.id,
      name : user.name,
      email : user.email
    }
  }


}
