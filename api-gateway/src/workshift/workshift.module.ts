import { forwardRef, Module } from '@nestjs/common';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'control-risk/schemas/user.schema';
import { WorkShiftController } from './workshift.controller';
import { WorkShiftService } from './workshift.service';
import { ProxyModule } from 'src/common/proxy/proxy.module';

// TODO modificar
@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [WorkShiftController],
  exports: [WorkShiftService],
  providers: [WorkShiftService],
})
export class WorkShiftModule {}
