import { forwardRef, Module } from '@nestjs/common';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsTypeController } from './newsType.controller';
import { NewsTypeService } from './newsType.service';
import { NewsType, NewsTypeSchema } from 'control-risk/schemas/newsType.schema';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';

// TODO para poder requerir otros servicios de otra carpeta debo importarlo aca
@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: NewsType.name,
        schema: NewsTypeSchema,
      },
    ]),
  ],
  controllers: [NewsTypeController],
  providers: [NewsTypeService],
})
export class NewsTypeModule {}
