import { ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuards extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    return {
      roles: roles ? roles : [],
      headers: context.switchToHttp().getRequest().headers,
      route: context.switchToHttp().getRequest().route,
    };
  }

  handleRequest<IUser>(
    err: HttpException,
    user: IUser,
    _info: any,
    context: ExecutionContext,
  ): IUser {
    if (err || !user)
      throw err instanceof HttpException
        ? new HttpException(err.getResponse(), err.getStatus())
        : new HttpException({ message: err ?? 'Sin sesión activa' }, 401);

    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
