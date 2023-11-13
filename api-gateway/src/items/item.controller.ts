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
import { ItemMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { ItemDTO } from './item.dto';

@ApiTags('Item')
@Controller('item')
export class ItemController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Get('/list')
  tryItemData(@Query() query: Partial<ItemDTO>) {
    return this.publisher(ItemMessage.GET_ITEMS_DATA, query);
  }
  @Put('/:_id')
  updateUserItemData(@Param() params: any, @Body() InventoryInfo: any) {
    return this.publisher(ItemMessage.UPDATE_ITEM_DATA, {
      ...params,
      ...InventoryInfo,
    });
  }

  @Put('/massive/agencies')
  updateMassiveItemData(@Body() InventoryInfo: any) {
    return this.publisher(ItemMessage.UPDATE_MASSIVE_ITEM_DATA, InventoryInfo);
  }
  @Delete('/:_id')
  deleteUserItemData(@Param() params: any, @Body() InventoryInfo: any) {
    return this.publisher(ItemMessage.UNASIGNED_ITEM_USER, {
      ...params,
      ...InventoryInfo,
    });
  }
}
