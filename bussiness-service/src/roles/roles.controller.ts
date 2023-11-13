import { Controller } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQ, RoleMessage, RoleValues } from 'src/common/Constants';
import { Payload, RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';

function RoleExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.RoleQueue,
    routingKey: params.pattern,
  });
}

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @RoleExchange({ pattern: RoleMessage.LIST })
  async list(@Payload() { from = 8, to = 14 }: { from: number; to: number }) {
    try {
      const data = (await this.roleService.list(from, to)).map((role) => {
        return { value: role.value, label: RoleValues[role.label] };
      });
      return { data };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudieron encontrar los roles',
      });
    }
  }
  @RoleExchange({ pattern: RoleMessage.LIST_RAW })
  async listWithCode(
    @Payload() { from = 8, to = 14 }: { from: number; to: number },
  ) {
    try {
      const data = await this.roleService.findAll(from, to);
      return {
        data: data.map((d) => ({
          _id: d._id,
          label: RoleValues[d.code],
          code: d.code,
        })),
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudieron encontrar los roles',
      });
    }
  }
}
