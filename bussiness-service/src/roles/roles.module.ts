import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Role, RoleSchema } from 'control-risk/schemas/rol.schema';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
    RabbitModule,
    ConfigModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
