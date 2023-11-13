import { Controller, HttpStatus } from '@nestjs/common';
import { PhysicalPositionsService } from './physical-positions.service';
import {
  PhysicalPositionDTO,
  UpdateCoordinatesDTO,
  filterPhysicalPositionDTO,
} from '../common/dto/physicalPosition.dto';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { PhysicalPositionMessage, RabbitMQ } from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { PhysicalPosition } from 'control-risk/schemas/physicalPosition.schema';
import { BasePayload } from 'src/common/dto/default.dto';

function physical(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.PhysicalPositionQueue,
    routingKey: params.pattern,
  });
}
@Controller('physical-positions')
export class PhysicalPositionsController {
  constructor(private readonly physicalServices: PhysicalPositionsService) {}

  @physical({ pattern: PhysicalPositionMessage.CREATE })
  create(@Payload() physical: PhysicalPositionDTO) {
    try {
      return this.physicalServices.create(physical);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo crear las las posiciones fisicas',
      });
    }
  }
  @physical({ pattern: PhysicalPositionMessage.FIND_ALL })
  findAll(@Payload() physicalPositionDTO: BasePayload<PhysicalPosition>) {
    try {
      return this.physicalServices.findWithFilter(physicalPositionDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las posiciones fisicas',
      });
    }
  }
  @physical({ pattern: PhysicalPositionMessage.FIND_RAW })
  findRaw(@Payload() physicalPositionDTO: Partial<PhysicalPosition>) {
    try {
      return this.physicalServices.findAll(physicalPositionDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las posiciones fisicas',
      });
    }
  }
  @physical({ pattern: PhysicalPositionMessage.FIND_ONE })
  findOne(@Payload() id: string) {
    try {
      return this.physicalServices.findOne(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar la posiciones fisicas',
      });
    }
  }
  @physical({ pattern: PhysicalPositionMessage.UPDATE })
  update(@Payload() { id, physical }) {
    try {
      return this.physicalServices.update(id, physical);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las posiciones fisicas',
      });
    }
  }
  @physical({ pattern: PhysicalPositionMessage.DELETE })
  delete(@Payload() id: string) {
    try {
      return this.physicalServices.inactivePhysicalPosition(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo borrar la posicion fisica',
      });
    }
  }
}
