import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UsersDto } from '../common/dto/users.dto';
import { UserDocument } from 'control-risk/schemas/user.schema';

@Injectable()
export class JwtServices {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(carnet: string, password: string): Promise<any> {
    const user = await this.userService.findByCarnet(carnet);
    const isValidPassword: boolean = await this.userService.checkPassword(
      password,
      user?.password ?? '',
    );
    if (user && isValidPassword) return user;
    return null;
  }
  async signIn(user: UserDocument): Promise<any> {
    await user.populate('role');
    if (user.role.name !== 'securityAgent') {
      const payload = { carnet: user.carnet };
      user.token = this.jwtService.sign(payload);
      user.connected = true;
      user.save();
      return { user };
    } else
      throw new UnauthorizedException({
        message:
          'Por el momento solo pueden iniciar sesión administradores y supervisores!!!',
      });
  }

  async signUp(user: UsersDto): Promise<UserDocument> {
    return this.userService.create(user);
  }

  async singOut(carnet: string) {
    return { user: await this.userService.singOut(carnet) };
  }

  async refreshToken(carnet: string) {
    const payload = { carnet };
    const token = this.jwtService.sign(payload);
    return { user: await this.userService.refreshToken(carnet, token) };
  }
}
