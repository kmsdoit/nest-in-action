import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import {validationSchema} from "./config/validationSchema";
import {TypeOrmModule} from "@nestjs/typeorm";
import authConfig from "./config/authConfig";


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST, // 'localhost',
      port: 5432,
      username: process.env.DATABASE_USERNAME, // 'root',
      password: process.env.DATABASE_PASSWORD, // 'test',
      database: 'nest',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule{}
