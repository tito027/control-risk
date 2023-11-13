import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { Role, RoleSchema } from 'control-risk/schemas/rol.schema';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
