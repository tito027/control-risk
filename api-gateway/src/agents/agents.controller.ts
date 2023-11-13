import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
  Request,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import * as path from 'path';
import { map, Observable } from 'rxjs';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import {
  ActiveRoles,
  AgentMessage,
  UserInformationsMessage,
} from 'src/common/Constants';
import {
  AgentsDTO,
  CreateAgentS1DTO,
  CreateAgentS2DTO,
  CreateAgentS3DTO,
  CreateAgentS4DTO,
  CreateAgentS5DTO,
  CreateAgentS6DTO,
  CreateAgentS7DTO,
  CreateAgentS8DTO,
  OverviewDTO,
  UserIdDTO,
} from 'src/common/dto/agents.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { UserDocument } from 'control-risk/user.schema';
import { AgentsService } from './agents.service';
import { JwtAuthGuards } from 'src/jwt/guards/jwt-auth.guards';
import { Roles } from 'src/jwt/guards/roles.guard';
import { UserService } from 'src/user/user.service';
import { Payload } from '@nestjs/microservices';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
    private readonly agentService: AgentsService,
    private readonly userService: UserService,
  ) {}

  public publisher = this.clientProxy.clientProxyUsers(this.amqpConnection);
  public agentPublisher = this.clientProxy.clientProxyAgent(
    this.amqpConnection,
  );
  public infoPublisher = this.clientProxy.clientProxyUInformation(
    this.amqpConnection,
  );

  // @Post('/table')
  // tryGetHolidayData(@Body() payrollInfo: UserIdDTO) {
  //   return this.agentPublisher(AgentMessage.GET_AGENTS_DATA, payrollInfo);
  // }

  @Post('/list')
  tryAgencies(@Body() agents: AgentsDTO) {
    return this.publisher(AgentMessage.FIND_ALL, agents);
  }

  @Post('/status/list/:carnet')
  getStatusList(@Param('carnet') carnet, @Body() agent) {
    return this.publisher(AgentMessage.LIST_STATUS, { ...agent, carnet });
  }

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Get('/status/list')
  async agentStatusList() {
    return this.publisher(AgentMessage.LIST_STATUS_VALUES, {});
  }

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Get('/status/reason/list')
  async agentStatusReasonList() {
    return this.publisher(AgentMessage.LIST_STATUS_REASON_VALUES, {});
  }

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Post('/status/update/:carnet')
  async updateAgentStatus(
    @Param('carnet') carnet,
    @Request() request,
    @Body() status,
  ) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(AgentMessage.UPDATE_STATUS, {
      ...status,
      carnet,
      createdBy: user._id.toString(),
    });
  }

  @Get('/carnet/:carnet')
  @Header('Content-type', 'application/pdf')
  getCarnet(@Param() carnet): Observable<StreamableFile> {
    return this.publisher(AgentMessage.GET_CARNET, carnet).pipe(
      map(({ pdf }) => {
        const readable = createReadStream(
          path.join(this.configService.get('FILE_PATH'), pdf),
        );
        return new StreamableFile(readable);
      }),
    );
  }

  @Get('/getAgent')
  getAgentByID(@Payload() agent: UserIdDTO) {
    return this.publisher(AgentMessage.GET_ID, agent);
  }

  @UseGuards(JwtAuthGuards)
  @Roles(ActiveRoles.admin, ActiveRoles.supervisor)
  @Post('/create')
  async reateAgents(@Body() agent: CreateAgentS1DTO, @Request() request) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(AgentMessage.CREATE, {
      ...agent,
      createdBy: user._id.toString(),
    });
  }

  @Put('/creates2')
  createAgentsS2(@Body() agent: CreateAgentS2DTO) {
    return this.publisher(AgentMessage.CREAT2, agent);
  }

  @Put('/creates3')
  createAgentsS3(@Body() agent: CreateAgentS3DTO) {
    return this.publisher(AgentMessage.CREAT3, agent);
  }

  @Put('/creates4')
  createAgentsS4(@Body() agent: CreateAgentS4DTO) {
    return this.publisher(AgentMessage.CREAT4, agent);
  }

  @Put('/creates5')
  createAgentsS5(@Body() agent: CreateAgentS5DTO) {
    return this.publisher(AgentMessage.CREAT5, agent);
  }

  @Put('/creates6')
  createAgentsS6(@Body() agent: CreateAgentS6DTO) {
    return this.publisher(AgentMessage.CREAT6, agent);
  }

  @Put('/creates7')
  createAgentsS7(@Body() agent: CreateAgentS7DTO) {
    return this.publisher(AgentMessage.CREAT7, agent);
  }

  @Put('/creates8')
  createAgentsS8(@Body() agent: CreateAgentS8DTO) {
    return this.publisher(AgentMessage.CREAT8, agent);
  }

  @Put('/update/:carnet')
  async update(@Param('carnet') carnet, @Body() agent: Partial<UserDocument>) {
    if (agent.userInformation) {
      const { userInformation: userInfId } = await this.agentService.find({
        carnet,
      });
      return this.infoPublisher(UserInformationsMessage.UPDATE, {
        query: { _id: userInfId },
        params: agent.userInformation,
      }).pipe(map((data) => ({ userInformation: data })));
    }
    return this.publisher(AgentMessage.UPDATE, {
      query: { carnet },
      params: agent,
    });
  }

  // Documents
  @Post('/docs/:carnet')
  @UseGuards(JwtAuthGuards)
  async addDoc(
    @Param('carnet') carnet,
    @Body() doc: UserDocument['userInformation']['docs'][0],
  ) {
    if (!doc) throw new BadRequestException('Se requiere envíe un documento!');
    const { userInformation: userInfId } = await this.agentService.find({
      carnet,
    });
    return this.infoPublisher(UserInformationsMessage.UPDATE_DOC, {
      id: userInfId,
      payload: doc,
    });
  }

  @Put('/edits1')
  editAgentsS1(@Body() agent: CreateAgentS1DTO) {
    return this.publisher(AgentMessage.EDIT, agent);
  }

  @Put('/delete')
  deleteAgent(@Body() userId: UserIdDTO) {
    return this.publisher(AgentMessage.DEL, userId);
  }

  @Post('/overview')
  getAgentInformation(@Body() overview: OverviewDTO) {
    return this.publisher(AgentMessage.OVERVIEW_AGENT, overview);
  }

  @UseGuards(JwtAuthGuards)
  @Get('/find/:id')
  findBusinessConfig(@Param('id') id: string) {
    return this.publisher(AgentMessage.FIND_ONE, id);
  }

  @Post('/assignment/list/:carnet')
  getAssignmentList(@Param('carnet') carnet, @Body() agent) {
    return this.publisher(AgentMessage.LIST_ASSIGNMENT, { ...agent, carnet });
  }

  @UseGuards(JwtAuthGuards)
  @Put('/update/assigment/:id')
  async updateConfig(
    @Request() request,
    @Param('id') id: string,
    @Body() payload,
  ) {
    const user = await this.userService.findOne(request.user);
    return this.publisher(AgentMessage.UPDATE_ASSIGNMENT, {
      id,
      ...payload,
      createdBy: user._id.toString(),
    });
  }
}
