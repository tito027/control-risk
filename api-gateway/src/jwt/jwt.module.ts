import { Module } from '@nestjs/common';
import { JwtController } from './jwt.controller';
import { JwtServices } from './jwt.service';
import { LocalStrategies } from './strategies/LocalStrategies';
import { JwtStrategies } from './strategies/jwt.strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from '../common/Constants';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT.secret,
      signOptions: {
        expiresIn: JWT.expiresIn,
        audience: JWT.appUrl,
      },
    }),
  ],
  controllers: [JwtController],
  providers: [JwtServices, LocalStrategies, JwtStrategies],
  exports: [JwtServices, LocalStrategies, JwtStrategies]
})
export class JwtModules {}
