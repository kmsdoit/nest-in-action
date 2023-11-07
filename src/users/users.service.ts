import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {EmailService} from "../email/email.service";
import * as uuid from 'uuid'
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {ulid} from "ulid";
@Injectable()
export class UsersService {

  constructor(
      private readonly emailService : EmailService,
      @InjectRepository(User) private userRepository : Repository<User>
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
    throw new Error('Method Not implemented')
  }

  async login(email : string, password : string) {
    throw new Error('Method Not Implemented')
  }

  async getUserInfoById(userId : string) {
    throw new Error('Method Not Implemented')
  }


}
