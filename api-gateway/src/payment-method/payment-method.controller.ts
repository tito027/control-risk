import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Query,
  Post,
  Put,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import { PaymentMethodMessage } from 'src/common/Constants';

import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('PaymentMethod')
@Controller('/payments/methods')
export class PaymentMethodController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
  ) {}

  public publisher = this.clientProxy.clientProxyPaymentMethod(
    this.amqpConnection,
  );

  /** data para selector de planillas historicas */
  @Get()
  tryPaymentMethodData() {
    console.log('llego a el controller');
    return this.publisher(PaymentMethodMessage.GET_PAYMENT_METHOD_DATA, {});
  }
}
