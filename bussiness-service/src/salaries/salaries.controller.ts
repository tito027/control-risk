import { Controller, HttpStatus } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQ, SalariesMessage } from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { BasePayload } from 'src/common/dto/default.dto';
import { Salary } from 'control-risk/schemas/salaries.schema';

function SalaryExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.SalariesExchange,
    routingKey: params.pattern,
  });
}
@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @SalaryExchange({ pattern: SalariesMessage.UPDATE_MANY })
  async updateMany(@Payload() salaryDTO: { [k: string]: Partial<Salary> }) {
    try {
      return this.salariesService.updateMany(salaryDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las agencias',
      });
    }
  }

  @SalaryExchange({ pattern: SalariesMessage.FIND_ALL })
  async findAll(@Payload() salaryDTO: BasePayload<Salary>) {
    try {
      return this.salariesService.findAll(salaryDTO);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar las agencias',
      });
    }
  }
}
