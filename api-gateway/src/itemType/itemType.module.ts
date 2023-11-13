import { forwardRef, Module } from '@nestjs/common';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemTypeController } from './itemType.controller';
import { ItemTypeService } from './itemType.service';
import { ItemType, ItemTypeSchema } from 'control-risk/schemas/itemType.schema';
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
        name: ItemType.name,
        schema: ItemTypeSchema,
      },
    ]),
  ],
  controllers: [ItemTypeController],
  providers: [ItemTypeService],
})
export class ItemTypeModule {}
