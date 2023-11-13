import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { New, NewSchema } from 'control-risk/schemas/new.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: New.name,
        schema: NewSchema,
      },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
