import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ClientProxyControl } from '../common/proxy/client.proxy';
import { BusinessDTO, filterBusinessDTO } from '../common/dto/business.dto';
import { Observable } from 'rxjs';
import { IBusiness } from '../common/interfaces/IBusiness';
import {
  ActiveRoles,
  AgenciesMessage,
  BusinessMessage,
} from '../common/Constants';
import { ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/jwt/guards/roles.guard';
import { Business } from 'control-risk/schemas/business.schema';
import { DefaultDTO } from 'src/common/dto/default.dto';
import { BasePayloadDTO } from 'src/common/dto/default.dto';
import { Agency } from 'control-risk/schemas/agency.schema';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly userService: UserService,
  ) {}
  private publisher = this.clientProxy.clientProxyBusiness(this.amqpConnection);
  private agencyPublisher = this.clientProxy.clientProxyAgencies(
    this.amqpConnection,
  );

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin)
  @Post('/create')
  async create(@Request() request, @Body() business: BusinessDTO) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(BusinessMessage.CREATE, {
      ...business,
      createdBy: user._id.toString(),
    });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find-all')
  findAll(@Body() businessDTO: filterBusinessDTO) {
    return this.publisher(BusinessMessage.FIND_ALL, businessDTO);
  }

  @UseGuards(JwtAuthGuards)
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() business: BusinessDTO,
  ): Observable<IBusiness> {
    return this.publisher(BusinessMessage.UPDATE, { id, business });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find/:id')
  findById(@Param('id') id: string): Observable<IBusiness> {
    return this.publisher(BusinessMessage.FIND_ONE, id);
  }

  @UseGuards(JwtAuthGuards)
  @Put('/delete/:id')
  deleteBusiness(@Param('id') id: string): Observable<IBusiness> {
    return this.publisher(BusinessMessage.DELETE, id);
  }
  /*
  @Get('/find/one/:id')
  findOne(@Param('id') id: string): Observable<IBusiness> {
    return this._clientProxyBusiness.send(BusinessMessage.FIND_ONE, id);
  }
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() business: BusinessDTO,
  ): Observable<IBusiness> {
    return this._clientProxyBusiness.send(BusinessMessage.UPDATE, {
      id,
      business,
    });
  }
  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Param('flag') flag: string) {
    return this._clientProxyBusiness.send(BusinessMessage.DELETE, { id, flag });
  }
  */
  @Get('/find/agencies/:id')
  findAgencies(@Param('id') id: string) {
    return this.agencyPublisher(AgenciesMessage.FIND_RAW_ALL, { business: id });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/statistics/:id')
  getStatistics(@Param('id') business: string) {
    return this.publisher(BusinessMessage.GET_STATISTICS, business);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find/agencies/:id')
  findAgenciesPost(
    @Param('id') id: string,
    @Body() body: BasePayloadDTO<Agency>,
  ) {
    body.strict = {
      business: {
        type: 'ObjectId',
        value: [id],
      },
    };
    return this.agencyPublisher(AgenciesMessage.FIND_ALL, body);
  }

  @Get()
  ListAll() {
    return this.publisher(BusinessMessage.LIST_ALL, '');
  }

  @UseGuards(JwtAuthGuards)
  @Get('list/agencies/:id')
  ListAgencies(@Param('id') id: string) {
    return this.publisher(BusinessMessage.LIST_AGENCIES, id);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/config/:id')
  findBusinessConfig(@Param('id') id: string) {
    return this.publisher(BusinessMessage.FIND_CONFIG, id);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/update/config/:id')
  updateConfig(@Param('id') id: string, @Body() payload) {
    return this.publisher(BusinessMessage.UPDATE_CONFIG, { id, ...payload });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/overview')
  getOverview(@Body() overview: Pick<Business, 'slug'>) {
    return this.publisher(BusinessMessage.OVERVIEW_BUSINESS, overview);
  }

  @Get('/contacts/:id')
  getContacts(@Param('id') id: string) {
    return this.publisher(BusinessMessage.GET_CONTACTS, { id });
  }

  @Post('/contacts/table/:id')
  getContactsTable(@Param('id') id: string, @Body() payload) {
    return this.publisher(BusinessMessage.GET_CONTACTS_TABLE, {
      id,
      ...payload,
    });
  }

  @Post('/contacts/:id')
  createContacts(@Param('id') id: string, @Body() payload) {
    return this.publisher(BusinessMessage.CREATE_CONTACT, {
      bussiness: id,
      ...payload,
    });
  }

  @Put('/contacts/:id')
  updateContacts(@Param('id') id: string, @Body() payload) {
    return this.publisher(BusinessMessage.UPDATE_CONTACT, {
      bussiness: id,
      ...payload,
    });
  }
}
