import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import {ConfigModule} from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import {validationSchema} from "./config/validationSchema";
import * as Joi from "joi";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [UsersModule,ConfigModule.forRoot({
    envFilePath: `${__dirname}/config/env/.${process.env.NODE_ENV}.env`,
    load: [emailConfig],
    isGlobal: true,
    validationSchema : validationSchema,
    validationOptions : {
      abortEarly: true,
    }
  }), EmailModule,
  TypeOrmModule.forRoot({
    type : 'postgres',
    host : process.env.DATABASE_HOST,
    port : 5432,
    username : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : 'nest',
    entities : [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize : process.env.DATABASE_SYNCHRONIZE === 'true'
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
