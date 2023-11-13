import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { IAuth, IAuthUser } from 'src/common/interfaces/IAuth.interface';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  async validateAdminUser(auth: IAuth, authUser: IAuthUser): Promise<any> {
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 9 ~ AuthService ~ validateAdminUser ~ authUser',
      authUser,
    );
    console.log(
      '🚀 ~ file: auth.service.ts ~ line 9 ~ AuthService ~ validateAdminUser ~ auth',
      auth,
    );

    if (
      authUser &&
      authUser.password === auth.password &&
      authUser.roleName == 'Administrador'
    ) {
      const { password, ...result } = authUser;
      return result;
    }
    return null;
  }
}
