import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PsychicDto } from '../common/dto/psychic.dto';
import { AnswerDto } from '../common/dto/answer.dto';
import { ClientProxyControl } from '../common/proxy/client.proxy';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PsychicMessage } from '../common/Constants';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';

@ApiTags('psychic')
@Controller('psychic')
export class PsychicController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly userService: UserService,
  ) {}
  public psychic = this.clientProxy.clientPhyshic(this.amqpConnection);

  @UseGuards(JwtAuthGuards)
  @Post('/create')
  async create(@Request() request, @Body() createPsychic: PsychicDto) {
    const user = await this.userService.findOne(request.user);

    return this.psychic(PsychicMessage.CREATE, {
      ...createPsychic,
      createdBy: user._id.toString(),
    });
  }

  @UseGuards(JwtAuthGuards)
  @Post('/find-all')
  findAll(@Body() PsychicDto) {
    return this.psychic(PsychicMessage.FIND_ALL, PsychicDto);
  }
  @UseGuards(JwtAuthGuards)
  @Post('/find-list')
  findList(@Body() PsychicDto) {
    return this.psychic(PsychicMessage.FIND_LIST, PsychicDto);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/:id')
  async findOne(@Param('id') id: string) {
    return this.psychic(PsychicMessage.FIND_ONE, id);
  }
  @UseGuards(JwtAuthGuards)
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() psychic: Partial<PsychicDto>) {
    return this.psychic(PsychicMessage.UPDATE, {
      id,
      psychic,
    });
  }
  @UseGuards(JwtAuthGuards)
  @Put('/delete/:id')
  delete(@Param('id') id: string) {
    return this.psychic(PsychicMessage.DELETE, id);
  }
  //Registrar una test a un usuario
  @UseGuards(JwtAuthGuards)
  @Post('/register')
  async register(@Request() request, @Body() answerDto: AnswerDto) {
    const user = await this.userService.findOne(request.user);

    return this.psychic(PsychicMessage.REGISTER, {
      ...answerDto,
      user: answerDto.userID,
      test: answerDto.testID,
      createdBy: user._id.toString(),
    });
  }

  //buscar una lista de respuestas por usuario
  @UseGuards(JwtAuthGuards)
  @Post('/find/answers/user')
  async findByUser(@Request() request, @Body() body: { user: string }) {
    return this.psychic(PsychicMessage.GETANSWERLISTBYUSER, body);
  }

  //buscar una lista de respuestas por usuario
  @UseGuards(JwtAuthGuards)
  @Post('/find/answers/id')
  async findById(@Request() request, @Body() body) {
    return this.psychic(PsychicMessage.GETANSWERBYID, body);
  }
}
