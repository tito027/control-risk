import { forwardRef, Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { DiscountService } from './discount.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from 'control-risk/schemas/discount.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Discount.name,
        schema: DiscountSchema,
      },
    ]),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
