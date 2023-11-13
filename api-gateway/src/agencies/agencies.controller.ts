import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AgenciesDTO, filterAgenciesDTO } from '../common/dto/agencies.dto';
import { ClientProxyControl } from '../common/proxy/client.proxy';
import {
  ActiveRoles,
  AgenciesMessage,
  PhysicalPositionMessage,
  UsersMessage,
} from '../common/Constants';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { Roles } from 'src/jwt/guards/roles.guard';
import { Agency } from 'control-risk/agency.schema';
import { BasePayloadDTO } from 'src/common/dto/default.dto';
import { PhysicalPosition } from 'control-risk/physicalPosition.schema';
import { User } from 'control-risk/schemas/user.schema';

@ApiTags('Agencies')
@Controller('agencies')
export class AgenciesController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly userService: UserService,
  ) {}
  public publisher = this.clientProxy.clientProxyAgencies(this.amqpConnection);
  public physicalPositions = this.clientProxy.clientProxyPhysicalPosition(
    this.amqpConnection,
  );
  public agents = this.clientProxy.clientProxyUsers(this.amqpConnection);

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin)
  @Post('/create')
  async create(@Request() request, @Body() agency: AgenciesDTO) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(AgenciesMessage.CREATE, {
      ...agency,
      createdBy: user._id.toString(),
    });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/statistics/:id')
  getStatistics(@Param('id') business: string) {
    return this.publisher(AgenciesMessage.GET_STATISTICS, business);
  }

  @Post('/find-all')
  findAll(@Body() agenciesDTO: filterAgenciesDTO) {
    return this.publisher(AgenciesMessage.FIND_ALL, agenciesDTO);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/overview')
  getOverview(@Body() overview: Pick<Agency, 'slug'>) {
    return this.publisher(AgenciesMessage.OVERVIEW_AGENCY, overview);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/:id')
  async findOne(@Param('id') id: string) {
    return this.publisher(AgenciesMessage.FIND_ONE, id);
  }

  @UseGuards(JwtAuthGuards)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() agency: AgenciesDTO) {
    return this.publisher(AgenciesMessage.UPDATE, {
      id,
      agency,
    });
  }

  @UseGuards(JwtAuthGuards)
  @Put('/delete/:id')
  delete(@Param('id') id: string) {
    return this.publisher(AgenciesMessage.DELETE, id);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find/agents/:id')
  findAgentsPost(@Param('id') id: string, @Body() body: BasePayloadDTO<User>) {
    body.strict = {
      ...body.strict,
      'assignment.agency': {
        type: 'ObjectId',
        value: [id],
      },
    };

    return this.agents(UsersMessage.FIND_ALL, body);
  }
  @UseGuards(JwtAuthGuards)
  @Post('/find/physicalpositions/:id')
  findAgenciesPost(
    @Param('id') id: string,
    @Body() body: BasePayloadDTO<PhysicalPosition>,
  ) {
    body.strict = {
      ...body.strict,
      agency: {
        type: 'ObjectId',
        value: [id],
      },
    };

    return this.physicalPositions(PhysicalPositionMessage.FIND_ALL, body);
  }

  @Get('/find/physicalpositions/:id')
  findPhysicalPosition(@Param('id') id: string) {
    return this.physicalPositions(PhysicalPositionMessage.FIND_RAW, {
      agency: id,
    });
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/config/:id')
  findAgencyConfig(@Param('id') id: string) {
    return this.publisher(AgenciesMessage.FIND_CONFIG, id);
  }

  @UseGuards(JwtAuthGuards)
  @Post('/update/config/:id')
  updateConfig(@Param('id') id: string, @Body() payload) {
    return this.publisher(AgenciesMessage.UPDATE_CONFIG, { id, ...payload });
  }
}
