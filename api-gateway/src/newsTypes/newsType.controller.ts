import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsTypeMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { NewsTypeDTO } from './newsType.dto';

@ApiTags('NewsType')
@Controller('news')
export class NewsTypeController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Get('/types')
  tryNewsTypeData(@Query() query: Partial<NewsTypeDTO>) {
    return this.publisher(NewsTypeMessage.GET_NEWS_TYPE_DATA, query);
  }
}
