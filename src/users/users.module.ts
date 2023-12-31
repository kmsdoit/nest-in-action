import {Logger, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {EmailService} from "../email/email.service";
import {EmailModule} from "../email/email.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([User]),
    AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, Logger],
})
export class UsersModule {}
