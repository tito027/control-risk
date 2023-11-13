import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UsersDto } from '../common/dto/users.dto';
import { UserIdDTO } from 'src/common/dto/agents.dto';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UsersMessage } from 'src/common/Constants';

@Controller('user')
export class UserController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly userService: UserService,
  ) {}
  private publisher = this.clientProxy.clientProxyUsers(this.amqpConnection);
  @Post('/create')
  create(@Body() user: UsersDto) {
    return this.userService.create(user);
  }
  @Get('')
  findAll() {
    return this.userService.findAll();
  }
  @Get('/find/one/:carnet')
  findOne(@Param('carnet') carnet: string) {
    return this.userService.findOne(carnet);
  }

  @Put('/update/:id')
  update(@Param('id') id: string, @Body() user: UsersDto) {
    return this.userService.update(user, id);
  }
  @Delete('/delete/:id/:flag')
  delete(@Param('id') id: string, @Param('flag') flag: boolean) {
    return this.userService.delete(id, flag);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/supervisor')
  findSupervisors() {
    return this.publisher(UsersMessage.LIST_SUPERVISOR, null);
  }
}
