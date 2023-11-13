import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ActiveRoles, EntriesMessage } from 'src/common/Constants';
import { EntriesDTO } from 'src/common/dto/checkInOut.dto';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { Roles } from 'src/jwt/guards/roles.guard';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Controller('entries')
export class EntriesController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}
  public publisher = this.clientProxy.clientProxyEntries(this.amqpConnection);

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Post('/list')
  checkInOutValidateList(@Body() payload: EntriesDTO) {
    return this.publisher(EntriesMessage.VALIDATE_LIST, payload);
  }
}
