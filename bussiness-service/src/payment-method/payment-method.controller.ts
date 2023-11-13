import { Controller, HttpStatus } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodMessage, RabbitMQ } from 'src/common/Constants';
import { RpcException } from '@nestjs/microservices';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';

function PaymentMethod(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.PaymentMethodQueue,
    routingKey: params.pattern,
  });
}
@Controller()
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @PaymentMethod({ pattern: PaymentMethodMessage.GET_PAYMENT_METHOD_DATA })
  async getPaymentMethodData() {
    try {
      return await this.paymentMethodService.findAll(
        { active: true },
        {
          _id: 0,
          key: '$_id',
          label: '$name',
          value: '$name',
          bank_entities: 1,
          need_account: 1,
        },
      );
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar la planilla buscada',
      });
    }
  }
}
