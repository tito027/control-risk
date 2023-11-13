import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersInformationsService } from '../users-informations/users-informations.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  AgentMessage,
  AgentStatusValues,
  RabbitMQ,
  RoleValues,
  UsersMessage,
} from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { UserDocument } from 'control-risk/schemas/user.schema';
import {
  CreateAgentS1DTO,
  CreateAgentS2DTO,
  CreateAgentS3DTO,
  CreateAgentS4DTO,
  CreateAgentS5DTO,
  CreateAgentS6DTO,
  CreateAgentS7DTO,
  CreateAgentS8DTO,
} from 'src/common/dto/userInformation.dto';
import { PaymentMethodUserService } from 'src/payment-method-user/payment-method-user.service';
import { UserIdDTO, OverviewDTO } from 'src/common/dto/users.dto';
import { AgentStatusService } from 'src/agent-status/agentStatus.service';
import { AgentStatus } from 'control-risk/schemas/agentStatus.schema';
import { BasePayload } from 'src/common/dto/default.dto';
import { RolesService } from 'src/roles/roles.service';
import { AssignmentHistoryService } from 'src/assignment-history/assignmentHistory.service';
import {v4 as uuidv4} from 'uuid'


function UsersExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.UsersQueue,
    routingKey: params.pattern,
  });
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersInfoService: UsersInformationsService,
    private readonly paymentMethodUserService: PaymentMethodUserService,
    private readonly roleService: RolesService,
    private readonly agentStatusService: AgentStatusService,
    private readonly assignmentHistoryService: AssignmentHistoryService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UsersExchange({ pattern: AgentMessage.UPDATE })
  async update(
    @Payload()
    {
      params,
      query,
    }: {
      params: Partial<UserDocument>;
      query: Partial<UserDocument>;
    },
  ) {
    const resp = await this.usersService.update(query, params);
    return resp.modifiedCount > 0 ? query : {};
  }

  @UsersExchange({ pattern: AgentMessage.GET_CARNET })
  async generatePdf(@Payload() { carnet }: { carnet: string }) {
    const user = await this.usersService.findByCarnet(carnet);
    const pdf = await this.usersService.generatePdf(user);
    console.group('**** pdf ****');
    console.log(pdf);
    console.groupEnd();
    return { pdf };
  }

  @UsersExchange({ pattern: AgentMessage.GET_CARNET_GROUP })
  async generatePdfMassive(@Payload() { ids }: { ids: any }) {
    const users = await this.usersService.findByCarnets(ids);
    const array = ids.split(',');
    console.log(array.length + '  ' + users.length);
    if (array.length == users.length) {
      const pdf = await this.usersService.generateMassivePdf(users);
      console.group('**** pdf ****');
      console.log(pdf);
      console.groupEnd();
      return { pdf, status: true };
    } else {
      return { status: false, message: 'Verificar que todos los carnets tengan imagen' };
    }
  }

  @UsersExchange({ pattern: AgentMessage.GET_ID })
  async getAgentByID(@Payload() userIdDTO: UserIdDTO) {
    let throwObject = {};
    try {
      const dato = await this.usersService.agencyById(userIdDTO.userId);
      if (dato) {
        const datosAgrupados = {
          s1: {
            name: dato[0].userinfodata[0].name,
            lastname: dato[0].userinfodata[0].lastname,
            address: dato[0].userinfodata[0].address,
            municipality: dato[0].userinfodata[0].municipality,
            department: dato[0].userinfodata[0].department,
            birthdate: dato[0].userinfodata[0].birthdate,
            birthplace: dato[0].userinfodata[0].birthplace,
            gender: dato[0].userinfodata[0].gender,
            allergic: dato[0].userinfodata[0].allergic,
            homePhone: dato[0].userinfodata[0].homePhone,
            cellPhone: dato[0].userinfodata[0].cellPhone,
            profession: dato[0].userinfodata[0].profession,
            afpType: dato[0].userinfodata[0].afpType,
            dui: dato[0].userinfodata[0].dui,
            expeditionDate: dato[0].userinfodata[0].expeditionDate,
            expeditionPlace: dato[0].userinfodata[0].expeditionPlace,
            isss: dato[0].userinfodata[0].isss,
            afpNup: dato[0].userinfodata[0].afpNup,
            ipsfa: dato[0].userinfodata[0].ipsfa,
            maritalStatus: dato[0].userinfodata[0].maritalStatus,
            driverLicense: dato[0].userinfodata[0].driverLicense,
            class: dato[0].userinfodata[0].class,
            weaponLicense: dato[0].userinfodata[0].weaponLicense,
            expirationWeaponLicense:
              dato[0].userinfodata[0].expirationWeaponLicense,
            bloodType: dato[0].userinfodata[0].bloodType,
            ansp: dato[0].userinfodata[0].ansp,
            anspDate: dato[0].userinfodata[0].anspDate,
            anspNo: dato[0].userinfodata[0].anspNo,
            carnet: dato[0].carnet,
            email: dato[0].userinfodata[0].email,
          },
          s2: {
            height: dato[0].userinfodata[0].height,
            weight: dato[0].userinfodata[0].weight,
            face: dato[0].userinfodata[0].face,
            lips: dato[0].userinfodata[0].lips,
            eyesColor: dato[0].userinfodata[0].eyesColor,
            nose: dato[0].userinfodata[0].nose,
            hairTypeColor: dato[0].userinfodata[0].hairTypeColor,
            skinColor: dato[0].userinfodata[0].skinColor,
            specialSings: dato[0].userinfodata[0].specialSings,
            tattos: dato[0].userinfodata[0].tattos,
            job: dato[0].userinfodata[0].job,
            salary: dato[0].userinfodata[0].salary,
          },
          s3: {
            master: dato[0].userinfodata[0].master,
            university: dato[0].userinfodata[0].university,
            certified: dato[0].userinfodata[0].certified,
            highSchool: dato[0].userinfodata[0].highSchool,
            thirdCycle: dato[0].userinfodata[0].thirdCycle,
            secondCycle: dato[0].userinfodata[0].secondCycle,
            firstCycle: dato[0].userinfodata[0].firstCycle,
            previousJob: dato[0].userinfodata[0].previousJob,
            militaryService: dato[0].userinfodata[0].militaryService,
            currentlyStudying: dato[0].userinfodata[0].currentlyStudying,
          },
          s4: {
            computerKnowledge: dato[0].userinfodata[0].computerKnowledge,
            englishKnowledge: dato[0].userinfodata[0].englishKnowledge,
            otherSkills: dato[0].userinfodata[0].otherSkills,
          },
          s5: {
            workHistory: dato[0].userinfodata[0].workHistory,
          },
          s6: {
            familyReferences: dato[0].userinfodata[0].familyReferences,
            personalReferences: dato[0].userinfodata[0].personalReferences,
          },
          s7: {
            familyRelationship: dato[0].userinfodata[0].familyRelationship,
          },
          s8: {
            cohabitant: dato[0].userinfodata[0].cohabitant,
          },
        };
        return {
          //datosdesordenados:dato[0].userinfodata[0],
          ...datosAgrupados,
          //carnet: dato[0].carnet,
          userInfoId: dato[0].userinfodata[0]._id,
          userId: userIdDTO.userId,
          nextStep: dato[0].userinfodata[0].nextStep,
        };
      }
      throwObject = {
        status: HttpStatus.NOT_FOUND,
        log: dato,
        message: 'No se encontro ningún registro',
      };
    } catch (err) {
      throwObject = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: err,
        message: 'Error deconocido',
      };
    }
    throw new RpcException(throwObject);
  }

  /**
   * Obtiene los usuarios a excepcion del administrador
   * @param UsersDTO
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.FIND_ALL })
  async agencyList(@Payload() usersDTO: BasePayload<UserDocument>) {
    let throwObject = {};
    try {
      const datos = await this.usersService.agencyList(usersDTO);
      console.log(datos);
      if (datos) {
        const datosfinal = [];
        datos.data.forEach((elements) => {
          const data = {
            carnet: elements.carnet,
            nombre: elements.nombre,
            agencia: elements?.agencia,
            empresa: elements?.empresa,
            userid: elements._id,
            userinfoid: elements?.userinfoid,
            active: elements?.active,
            status: elements?.status,
            nextStep: elements?.nextStep,
          };
          datosfinal.push(data);
        });
        return {
          data: datosfinal,
          totalRegistros: datos.totalRegistros,
        };
      }
      throwObject = {
        status: HttpStatus.NOT_FOUND,
        log: datos,
        message: 'No se encontro ningún registro',
      };
    } catch (err) {
      throwObject = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: err,
        message: 'Error deconocido',
      };
    }
    throw new RpcException(throwObject);
  }

  /**
   * Obtiene el listado de status de un agente
   * @param UsersDTO
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.LIST_STATUS })
  async statusList(@Payload() usersDTO) {
    const userId = (await this.usersService.findByCarnet(usersDTO.carnet))._id;
    return await this.agentStatusService.listByCarnet(userId, usersDTO);
  }

  /**
   * Lista los posibles status de los agentes
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.LIST_STATUS_VALUES })
  async listAgentStatus() {
    return {
      data: [
        {
          value: '0',
          label: 'Pre-selección',
        },
        {
          value: '1',
          label: 'Pruebas y Entrevistas',
        },
        {
          value: '2',
          label: 'Rechazado',
        },
        {
          value: '3',
          label: 'Contratación e inducción',
        },
        {
          value: '4',
          label: 'Activo',
        },
        {
          value: '5',
          label: 'Baja',
        },
        {
          value: '6',
          label: 'Inaceptables',
        },
        {
          value: '7',
          label: 'Turno Extra',
        },
        {
          value: '8',
          label: 'Reingreso',
        },
      ],
    };
  }

  /**
   * Lista los posibles reasons de status de los agentes
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.LIST_STATUS_REASON_VALUES })
  async listAgentStatusReason() {
    return {
      data: [
        {
          value: 'Abandono',
          label: 'Abandono',
        },
        {
          value: 'Renuncia voluntaria',
          label: 'Renuncia voluntaria',
        },
        {
          value: 'Jubilación',
          label: 'Jubilación',
        },
        {
          value: 'Despido por falta',
          label: 'Despido por falta',
        },
        {
          value: 'Proyecto finalizado',
          label: 'Proyecto finalizado',
        },
        {
          value: 'Solicitud de Cliente',
          label: 'Solicitud de Cliente',
        },
        {
          value: 'Otro trabajo',
          label: 'Otro trabajo',
        },
        {
          value: 'Descontento con la plaza',
          label: 'Descontento con la plaza',
        },
      ],
    };
  }

  /**
   * Actualiza el status de un agente
   * @param UsersDTO
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.UPDATE_STATUS })
  async updateAgentStatus(@Payload() status) {
    const { carnet, ...data } = status;
    return this.agentStatusService.updateAgentStatus(data);
  }

  /**
   * Obtiene los usuarios a excepcion del administrador
   * @param OverviewDTO
   * @returns
   */
  @UsersExchange({ pattern: AgentMessage.OVERVIEW_AGENT })
  async agentOverview(@Payload() UsersDTO: OverviewDTO) {
    let throwObject = {};
    try {
      const datos = await this.usersService.agencyOverview(UsersDTO.carnet);
      // return datos;
      if (datos) {
        const data = {
          _id: datos._id,
          username: datos.username,
          image: Boolean(datos.image),
          carnet: datos.carnet,
          connected: datos.connected,
          working: datos.working,
          active: datos.active,
          status: datos.agentstatus[0]?.status,
          createdAt: datos.createdAt,
          updateAt: datos.updateAt,
          userinformation: datos.userinfodata[0],
          agencydata: datos.agencydata[0],
          businessesdata: datos.businessesdata[0],
        };
        return data;
      }
      throwObject = {
        status: HttpStatus.NOT_FOUND,
        log: datos,
        message: 'No se encontro ningún registro',
      };
    } catch (err) {
      throwObject = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: err,
        message: 'Error desconocido',
      };
    }
    throw new RpcException(throwObject);
  }
  @UsersExchange({ pattern: AgentMessage.CREATE })
  async createAgent(@Payload() createAgentDTO: CreateAgentS1DTO) {
    const dataDuplicate = await this.usersInfoService.findDuplicate(
      createAgentDTO.dui,
    );
    if (dataDuplicate.dui) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: 'El DUI ingresado ya existe',
        message: 'No se pudo crear el agente: El DUI ingresado ya existe',
      });
    } else {
      const username = createAgentDTO.name + '.' + createAgentDTO.lastname;
      let carnet;
      if (!createAgentDTO.carnet) {
        carnet = uuidv4()
        // let bandera;
        // do {
        //   const apellidos = createAgentDTO.lastname.toUpperCase().split(' ');
        //   const primerasLetras = [];
        //   const numeros = [];
        //   for (let i = 0; i < 5; i++) {
        //     const numero = Math.floor(Math.random() * 10);
        //     numeros.push(numero);
        //   }
        //   if (apellidos.length == 1) {
        //     const primeraLetra = apellidos[0][0] + apellidos[0][1];
        //     primerasLetras.push(primeraLetra);
        //   } else {
        //     const primeraLetra = apellidos[0][0] + apellidos[1][0];
        //     primerasLetras.push(primeraLetra);
        //   }
        //   carnet = primerasLetras.join('') + numeros.join('');
        //   const carnetDuplicate = await this.usersService.findDuplicate(carnet);
        //   bandera = carnetDuplicate.carnet;
        // } while (bandera);
      } else {
        const carnetDuplicate = await this.usersService.findDuplicate(
          createAgentDTO.carnet,
        );
        if (carnetDuplicate.carnet) {
          throw new RpcException({
            status: HttpStatus.CONFLICT,
            log: 'El carnet ingresado ya existe',
            message:
              'No se pudo crear el agente: El carnet ingresado ya existe',
          });
        } else {
          carnet = createAgentDTO.carnet;
        }
      }
      const roleId = this.roleService.findRole('securityAgent');
      const newagentInfo = await this.usersInfoService.create(createAgentDTO);
      const newagent = await this.usersService.create(
        newagentInfo._id,
        carnet,
        username.replace(/\s+/g, ''),
        createAgentDTO.dui,
        (
          await roleId
        )._id,
        createAgentDTO.createdBy,
      );
      const datospasar: AgentStatus = {
        code: 0,
        user: newagent._id,
        createdBy: createAgentDTO.createdBy,
        status: AgentStatusValues[0],
        reason: null,
        coment: null,
        date: new Date(),
        active: true,
        deletedAt: null,
      };
      this.agentStatusService.updateAgentStatus(datospasar);
      const message = {
        status: true,
        data: createAgentDTO,
        userId: newagent._id,
        userInfoId: newagentInfo._id,
      };
      return message;
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT2 })
  async createAgentS2(@Payload() createAgentS2DTO: CreateAgentS2DTO) {
    try {
      await this.usersInfoService.creates2(createAgentS2DTO);
      const message = {
        status: true,
        data: createAgentS2DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT3 })
  async createAgentS3(@Payload() createAgentS3DTO: CreateAgentS3DTO) {
    try {
      await this.usersInfoService.creates3(createAgentS3DTO);
      const message = {
        status: true,
        data: createAgentS3DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT4 })
  async createAgentS4(@Payload() createAgentS4DTO: CreateAgentS4DTO) {
    try {
      await this.usersInfoService.creates4(createAgentS4DTO);
      const message = {
        status: true,
        data: createAgentS4DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT5 })
  async createAgentS5(@Payload() createAgentS5DTO: CreateAgentS5DTO) {
    try {
      await this.usersInfoService.creates5(createAgentS5DTO);
      const message = {
        status: true,
        data: createAgentS5DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT6 })
  async createAgentS6(@Payload() createAgentS6DTO: CreateAgentS6DTO) {
    try {
      await this.usersInfoService.creates6(createAgentS6DTO);
      const message = {
        status: true,
        data: createAgentS6DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT7 })
  async createAgentS7(@Payload() createAgentS7DTO: CreateAgentS7DTO) {
    try {
      await this.usersInfoService.creates7(createAgentS7DTO);
      const message = {
        status: true,
        data: createAgentS7DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.CREAT8 })
  async createAgentS8(@Payload() createAgentS8DTO: CreateAgentS8DTO) {
    try {
      await this.usersInfoService.creates8(createAgentS8DTO);
      await this.usersService.updateAgentSatus(createAgentS8DTO.userId);
      const message = {
        status: true,
        data: createAgentS8DTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.DEL })
  async deleteAgent(@Payload() userId: UserIdDTO) {
    try {
      await this.usersService.inactiveAgent(userId.userId);
      const message = {
        status: true,
        data: 'Usuario eliminado correctamente',
      };
      return message;
    } catch (err) {
      console.log(err);
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo eliminar al agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.EDIT })
  async editAgentS1(@Payload() EditAgentDTO: CreateAgentS1DTO) {
    try {
      await this.usersInfoService.edits1(EditAgentDTO);
      const message = {
        status: true,
        data: EditAgentDTO,
      };
      return message;
    } catch (err) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: err,
        message: 'No se pudo actualizar los datos del agente',
      });
    }
  }

  @UsersExchange({ pattern: UsersMessage.LIST_SUPERVISOR })
  async listSupervisors() {
    try {
      return { data: await this.usersService.listSupervisors() };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.FIND_ONE })
  findAgent(@Payload() agent: string) {
    try {
      return this.usersService.findAgent(agent);
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar el agente',
      });
    }
  }

  @UsersExchange({ pattern: AgentMessage.LIST_ASSIGNMENT })
  async assignmentList(@Payload() usersDTO) {
    const userId = (await this.usersService.findByCarnet(usersDTO.carnet))._id;
    const listData = await this.assignmentHistoryService.listByUser(
      userId,
      usersDTO,
    );
    const data = listData.data.map((assignment) => {
      const { role, ...assign } = assignment;
      return { ...assign, role: RoleValues[role] };
    });
    return { data, totalRegistros: listData.totalRegistros };
  }

  @UsersExchange({ pattern: AgentMessage.UPDATE_ASSIGNMENT })
  updateAssignmnet(@Payload() agent: any) {
    try {
      const { id, salary, createdBy, ...payload } = agent;
      return this.usersService.updateAssigment(id, payload, salary, createdBy);
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las asignaciones del agente',
      });
    }
  }
}
