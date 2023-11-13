import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { User, UserSchema } from 'control-risk/schemas/user.schema';
import { Role, RoleSchema } from 'control-risk/schemas/rol.schema';
import { RolesModule } from 'src/role/role.module';

@Module({
  imports: [
    ProxyModule,
    RolesModule,
    forwardRef(() => RabbitModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
