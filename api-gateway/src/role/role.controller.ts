import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RoleMessage } from 'src/common/Constants';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}
  private publisher = this.clientProxy.clientProxyRoles(this.amqpConnection);

  @UseGuards(JwtAuthGuards)
  @Get('list')
  findAll(@Query('from') from = 8, @Query('to') to = 14) {
    return this.publisher(RoleMessage.LIST, {
      from: parseInt(from.toString()),
      to: parseInt(to.toString())
    });
  }

  @UseGuards(JwtAuthGuards)
  @Get('raw')
  findRaw(@Query('from') from = 8, @Query('to') to = 14) {
    return this.publisher(RoleMessage.LIST_RAW, {
      from: parseInt(from.toString()),
      to: parseInt(to.toString())
    });
  }
}
