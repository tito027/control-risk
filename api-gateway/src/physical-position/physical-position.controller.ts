import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxyControl } from '../common/proxy/client.proxy';
import {
  PhysicalPositionDTO,
  UpdateCoordinatesDTO,
  filterPhysicalPositionsDTO,
} from '../common/dto/physicalPosition.dto';
import {
  ActiveRoles,
  AgenciesMessage,
  PhysicalPositionMessage,
} from '../common/Constants';
import { ApiTags } from '@nestjs/swagger';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { Roles } from 'src/jwt/guards/roles.guard';
import { UserService } from 'src/user/user.service';

@ApiTags('Physical Positions')
@Controller('physical-position')
export class PhysicalPositionController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly userService: UserService,
  ) {}
  private publisher = this.clientProxy.clientProxyPhysicalPosition(
    this.amqpConnection,
  );
  private agencyPublisher = this.clientProxy.clientProxyAgencies(
    this.amqpConnection,
  );

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin)
  @Post('/create')
  async create(@Request() request, @Body() physical: PhysicalPositionDTO) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(PhysicalPositionMessage.CREATE, {
      ...physical,
      createdBy: user._id.toString(),
    });
  }

  @UseGuards(JwtAuthGuards)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() physical: PhysicalPositionDTO) {
    return this.publisher(PhysicalPositionMessage.UPDATE, {
      id,
      physical,
    });
  }

  @UseGuards(JwtAuthGuards)
  @Put('/delete/:id')
  delete(@Param('id') id: string) {
    return this.publisher(PhysicalPositionMessage.DELETE, id);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/:id')
  async findOne(@Param('id') id: string) {
    return this.publisher(PhysicalPositionMessage.FIND_ONE, id);
  }

  @Post('/update-coordinates/:id')
  updateCoordinates(
    @Param('id') id: string,
    @Body() coordinates: UpdateCoordinatesDTO,
  ) {
    return this.agencyPublisher(AgenciesMessage.UPDATE_COORDINATES, {
      id,
      ...coordinates,
    });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find-all')
  findAll(@Body() physicalPositionsDTO: filterPhysicalPositionsDTO) {
    return this.publisher(
      PhysicalPositionMessage.FIND_ALL,
      physicalPositionsDTO,
    );
  }
}
