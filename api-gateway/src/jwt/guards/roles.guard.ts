import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/user/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const req = context.switchToHttp().getRequest();
    if(roles.length) {
      if(!(await this.userService.verifyRoles(req.carnet, roles)))
        throw new UnauthorizedException({
          message: 'No tienes autorización para realizar esta acción!!!',
        });
    }
    return true;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);