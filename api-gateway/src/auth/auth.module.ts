import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from './constants';

@Module({
  providers: [AuthService],
  imports: [
    UserModule,
    PassportModule,
    JwtModule,
    JwtModule.register({
      secret: JWT.key,
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
