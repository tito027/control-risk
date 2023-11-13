import {
  Body,
  Controller,
  Post,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthBasicDTO } from 'src/common/dto/authBasic.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuards } from 'src/jwt/guards/local-auth.guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuards)
  @Post('basic')
  async basicAuth(@Req() req) {
    // const user = req.user;
    // console.log(user, 'USER');
    const message = {
      status: HttpStatus.ACCEPTED,
      message: 'Usuario Verificado exitosamente',
    };
    return message;
  }
  @Post('/jwt/qr')
  async jwtQR(@Body() auth: AuthBasicDTO) {
    const JWT = this.jwtService.sign(auth);

    if (!!JWT) return { JWT };
    throw new RpcException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'No se pudo generar el JWT',
      log: `No se pudo generar el jwt con el carnet: ${auth.carnet} en el servicio de auth service, en la función de jwtQR`,
    });
  }
}
