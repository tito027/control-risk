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
import { InventoryMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { InventoryDTO } from './inventory.dto';
import { Payload } from '@nestjs/microservices';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post()
  tryUploadInventoryData(@Payload() payload: any) {
    console.log('UPLOAD', payload);
    return this.publisher(InventoryMessage.UPLOAD_INVENTORY_DATA, payload);
  }

  @Post('/table')
  tryInventoryData(@Payload() query: { need_list: boolean }) {
    return this.publisher(InventoryMessage.GET_INVENTORY_DATA, query);
  }

  @Get('/table/items')
  getInventoryData(@Payload() payload: any, @Query() query: any) {
    return this.publisher(InventoryMessage.GET_NO_AGENCY_DATA, {
      ...payload,
      ...query,
    });
  }

  @Put('/:_id')
  updateReportsData(@Param() params: any, @Body() InventoryInfo: any) {
    return this.publisher(InventoryMessage.UPDATE_INVENTORY_DATA, {
      ...params,
      ...InventoryInfo,
    });
  }
}
