import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { JwtServices } from '../jwt.service';

@Injectable()
export class LocalStrategies extends PassportStrategy(Strategy) {
  constructor(private readonly authService: JwtServices) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user)
      throw new UnauthorizedException({
        message: 'Carnet o contraseña incorrectas',
      });
    return user;
  }
}
