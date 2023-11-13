import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtServices } from './jwt.service';
import { LocalAuthGuards } from './guards/local-auth.guards';
import { UsersDto } from '../common/dto/users.dto';
import { JwtAuthGuards } from './guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';

@ApiTags('Authentication')
@Controller('auth')
export class JwtController {
  constructor(
    private readonly authService: JwtServices,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuards)
  @Get('validatedToken')
  async validateToken(@Req() req) {
    const user = await this.userService.findByCarnet(req.user);
    await user.populate('role');
    return { validToken: true, user };
  }

  @UseGuards(LocalAuthGuards)
  @Post('signin')
  async signIn(@Req() req) {
    return this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuards)
  @Post('refresh')
  async refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuards)
  @Post('singout')
  async signOut(@Req() req) {
    return this.authService.singOut(req.user);
  }

  @Post('signup')
  async signUp(@Body() user: UsersDto) {
    return this.authService.signUp(user);
  }
}
