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
import { ItemTypeMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { ItemTypeDTO } from './itemType.dto';

@ApiTags('ItemType')
@Controller('items/types')
export class ItemTypeController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Get()
  tryItemTypeData(@Query() query: Partial<ItemTypeDTO>) {
    return this.publisher(ItemTypeMessage.GET_ITEMS_TYPE_DATA, query);
  }
}
