import {
  Controller,
  Get,
  HttpStatus,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PsychicService } from './psychic.service';
import { PsychicDto } from '../common/dto/psychic.dto';
import { PsychicMessage, RabbitMQ } from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  Psychic as PsychicModel,
  PsychicDocument,
} from 'control-risk/schemas/psychic.schema';
import {
  Answer as AnswerModel,
  AnswerDocument,
} from 'control-risk/schemas/answers.schema';
import { AnswerDto } from '../common/dto/answer.dto';

function PsychicExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.PsychicQueue,
    routingKey: params.pattern,
  });
}
@Controller()
export class PsychicController {
  constructor(private readonly psychicService: PsychicService) {}

  @PsychicExchange({ pattern: PsychicMessage.CREATE })
  create(@Payload() createPsychicDto: PsychicDto) {
    try {
      return this.psychicService.create(createPsychicDto);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo crear las prueba VSA',
      });
    }
  }

  @PsychicExchange({ pattern: PsychicMessage.FIND_ALL })
  async findByFilter(@Payload() params: Partial<PsychicModel>) {
    try {
      return await this.psychicService.findByFilter(params);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las pruebas',
      });
    }
  }
  @PsychicExchange({ pattern: PsychicMessage.FIND_LIST })
  async findList(
    @Payload() params: Partial<PsychicModel>,
  ): Promise<PsychicDocument[]> {
    try {
      return await this.psychicService.findList();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar la lista de pruebas',
      });
    }
  }
  @PsychicExchange({ pattern: PsychicMessage.FIND_ONE })
  findOne(@Payload() id: string) {
    try {
      return this.psychicService.findOne(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo buscar la prueba',
      });
    }
  }

  @PsychicExchange({ pattern: PsychicMessage.UPDATE })
  update(@Payload() { id, psychic }: any) {
    try {
      console.log(id, psychic);
      return this.psychicService.update(id, psychic);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo actualizar la prueba',
      });
    }
  }

  @PsychicExchange({ pattern: PsychicMessage.DELETE })
  delete(@Payload() id: string) {
    try {
      return this.psychicService.inactivePsychic(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: error,
        message: 'No se pudo borrar la prueba',
      });
    }
  }
  @PsychicExchange({ pattern: PsychicMessage.REGISTER })
  register(@Payload() createAnswer: AnswerDto) {
    try {
      return this.psychicService.register(createAnswer);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: error,
        message: 'No se pudo registrar la prueba',
      });
    }
  }
  @PsychicExchange({ pattern: PsychicMessage.GETANSWERLISTBYUSER })
  findByUser(@Payload() Payload) {
    try {
      return this.psychicService.findAnswerListByUser(Payload);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: error,
        message: 'No se pudo obtener las respuestas',
      });
    }
  }
  @PsychicExchange({ pattern: PsychicMessage.GETANSWERBYID })
  findById(@Payload() Payload) {
    try {
      return this.psychicService.findAnswerById(Payload);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: error,
        message: 'No se pudo obtener la respuesta',
      });
    }
  }
}
