import { forwardRef, Module } from '@nestjs/common';
import { GratificationController } from './gratification.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { GratificationService } from './gratification.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Gratification,
  GratificationSchema,
} from 'control-risk/schemas/gratification.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Gratification.name,
        schema: GratificationSchema,
      },
    ]),
  ],
  controllers: [GratificationController],
  providers: [GratificationService],
})
export class GratificationModule {}
