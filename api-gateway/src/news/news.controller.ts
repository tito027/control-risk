import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewsMessage } from 'src/common/Constants';
import { NewsDTO } from 'src/common/dto/news.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post('/table')
  getNewsData(@Body() newsInfo: any) {
    return this.publisher(NewsMessage.GET_NEWS_DATA, newsInfo);
  }

  @Post()
  addNewsData(@Body() newsInfo: NewsDTO) {
    return this.publisher(NewsMessage.CREATE_NEWS_DATA, { ...newsInfo });
  }

  @Put('/:_id')
  updateNewsData(@Param() params: any, @Body() newsInfo: any) {
    return this.publisher(NewsMessage.UPDATE_NEWS_DATA, {
      ...params,
      ...newsInfo,
    });
  }

  @Delete('/:_id')
  deleteNewsData(@Param('_id') _id: string) {
    return this.publisher(NewsMessage.DELETE_NEWS_DATA, _id);
  }
}
