import { Controller, HttpStatus } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { AgenciesDTO, filterAgenciesDTO } from '../common/dto/agencies.dto';
import { AgenciesMessage, RabbitMQ } from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Agency } from 'control-risk/schemas/agency.schema';
import { BasePayload } from 'src/common/dto/default.dto';
import { UpdateCoordinatesDTO } from 'src/common/dto/physicalPosition.dto';

function AgencyExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.AgenciesQueue,
    routingKey: params.pattern,
  });
}

@Controller()
export class AgenciesController {
  constructor(private readonly agencyServices: AgenciesService) {}

  @AgencyExchange({ pattern: AgenciesMessage.FIND_RAW_ALL })
  async findRaw(@Payload() agencyDTO: filterAgenciesDTO) {
    try {
      return this.agencyServices.findAll(agencyDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las agencias',
      });
    }
  }

  @AgencyExchange({ pattern: AgenciesMessage.UPDATE_COORDINATES })
  updateCoordinates(@Payload() payload: UpdateCoordinatesDTO) {
    try {
      return this.agencyServices.update(payload.id, {
        latitude: payload.lat,
        longitude: payload.lng,
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudieron actualizar las coordenadas',
      });
    }
  }
  @AgencyExchange({ pattern: AgenciesMessage.OVERVIEW_AGENCY })
  async agentOverview(@Payload() payload: Partial<Agency>) {
    let throwObject = {};
    try {
      const datos = await this.agencyServices.findOneByParams(payload);
      if (datos) return datos;
      throwObject = {
        status: HttpStatus.NOT_FOUND,
        log: datos,
        message: 'No se encontro ninguna agencia!',
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
  @AgencyExchange({ pattern: AgenciesMessage.FIND_ALL })
  async findAll(@Payload() agencyDTO: BasePayload<Agency>) {
    try {
      return this.agencyServices.findWithFilter(agencyDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las agencias',
      });
    }
  }
  @AgencyExchange({ pattern: AgenciesMessage.GET_STATISTICS })
  async getStatistics(@Payload() businessId: string) {
    try {
      return this.agencyServices.getIndicators(businessId);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }
  @AgencyExchange({ pattern: AgenciesMessage.CREATE })
  create(@Payload() agency: AgenciesDTO) {
    try {
      return this.agencyServices.create(agency);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo crear las agencias',
      });
    }
  }

  @AgencyExchange({ pattern: AgenciesMessage.FIND_ONE })
  findOne(@Payload() id: string) {
    try {
      return this.agencyServices.findOne(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo buscar las agencia',
      });
    }
  }
  @AgencyExchange({ pattern: AgenciesMessage.UPDATE })
  update(@Payload() { id, agency }: any) {
    try {
      return this.agencyServices.update(id, agency);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo actualizar las agencias',
      });
    }
  }
  @AgencyExchange({ pattern: AgenciesMessage.DELETE })
  delete(@Payload() id: string) {
    try {
      return this.agencyServices.inactiveAgency(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: error,
        message: 'No se pudo borrar la agencia',
      });
    }
  }
  /*   @AgencyExchange({ pattern: AgenciesMessage.FIND_PHYSICALS })
  findPhysicalPosition(@Payload() id: string) {
    try {
      const physical = this.agencyServices.findPhysicalPosition(id);
      if (!physical)
        throw new RpcException({
          message: 'No se ha encontrado las posiciones fisicas',
          status: HttpStatus.NOT_FOUND,
        });
      return physical;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo buscar las posiciones fisicas por agencias',
      });
    }
  } */

  @AgencyExchange({ pattern: AgenciesMessage.FIND_CONFIG })
  findAgencyExchangeConfig(@Payload() business: string) {
    try {
      return this.agencyServices.findConfig(business);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar la agencia',
      });
    }
  }

  @AgencyExchange({ pattern: AgenciesMessage.UPDATE_CONFIG })
  updateAgencyExchangeConfig(@Payload() business: any) {
    try {
      const { id, ...payload } = business;
      return this.agencyServices.update(id, payload);
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }
}
