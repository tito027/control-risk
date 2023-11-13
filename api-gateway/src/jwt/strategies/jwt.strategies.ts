import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JWT } from '../../common/Constants';

export type JwtRequest = Pick<Request, 'headers' | 'header' | 'route'> & {
  roles: string[];
};

@Injectable()
export class JwtStrategies extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT.secret,
      passReqToCallback: true,
    });
  }
  async validate(req: JwtRequest, payload: any) {
    const token = req.headers.authorization.split('Bearer ')[1];
    const roles: string[] = req.roles;
    const user = await this.userService.verifyToken(payload.carnet, token);
    if (!user)
      throw new UnauthorizedException({
        message: 'Token Invalido!!!',
      });
    else if(roles.length) {
      if(!(await this.userService.verifyRoles(user.carnet, roles)))
        throw new UnauthorizedException({
          message: 'No tienes autorización para realizar esta acción!!!',
        });
    }
    return user.carnet;
  }
}
