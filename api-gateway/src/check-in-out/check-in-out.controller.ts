import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveRoles, CheckInOutMessage } from 'src/common/Constants';
import {
  CheckInOutDTO,
  EntriesDTO,
  HistoryCheckInOutDTO,
  TryCheckInOutDTO,
} from 'src/common/dto/checkInOut.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { Roles, RolesGuard } from 'src/jwt/guards/roles.guard';

@ApiTags('Check In/Out')
@Controller('check-in-out')
export class CheckInOutController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}
  public publisher = this.clientProxy.clientProxyCheckInOut(
    this.amqpConnection,
  );

  @Post('/try')
  tryCheckInOut(@Body() checkInOut: TryCheckInOutDTO) {
    return this.publisher(CheckInOutMessage.TRY_CHECK_IN_OUT, checkInOut);
  }

  @Post()
  checkInOut(@Body() checkInOut: CheckInOutDTO) {
    return this.publisher(CheckInOutMessage.CHECK_IN_OUT, checkInOut);
  }

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Post('/history')
  checkInOutHistory(@Body() checkInOut: HistoryCheckInOutDTO) {
    return this.publisher(CheckInOutMessage.FIND_ALL, checkInOut);
  }
}
