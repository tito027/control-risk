import { forwardRef, Module } from '@nestjs/common';
import { RequestUserController } from './requestUser.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { RequestUserService } from './requestUser.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestUser,
  RequestUserSchema,
} from 'control-risk/schemas/requestUser.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: RequestUser.name,
        schema: RequestUserSchema,
      },
    ]),
  ],
  controllers: [RequestUserController],
  providers: [RequestUserService],
})
export class RequestUserModule {}
