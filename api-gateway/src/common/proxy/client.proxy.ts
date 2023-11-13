import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Exchanges, RabbitMQ } from '../Constants';
import { from, Observable } from 'rxjs';

@Injectable()
export class ClientProxyControl {
  constructor(private readonly config: ConfigService) {}
  handlerResponse<T>(callback: Promise<T>): Observable<T> {
    return from(
      callback
        .then<T>((res) => {
          if (typeof res === 'object' && res.hasOwnProperty('error')) {
            const {
              error: { log, ...error },
            } = res as any;
            console.log(log);
            throw new HttpException(error, error.status);
          }
          return res;
        })
        .catch((err) => {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }),
    );
  }

  clientProxyBusiness(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Business,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }

  clientProxySalaries(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Salaries,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }

  clientProxyPayroll(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Payroll,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }

  clientProxyPaymentMethod(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.PaymentMethod,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }

  clientProxyAgencies(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Agencies,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }
  clientProxyPhysicalPosition(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Physicalposition,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
    /*
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.PhysicalPositionQueue,
      },
    });*/
  }
  clientProxySchedules(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: RabbitMQ.SchedulesQueue,
      },
    });
  }
  clientProxyEntries(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Entries,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }
  clientProxyCheckInOut(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.CheckInOut,
          routingKey,
          payload,
          timeout: 100000,
        }),
      );
    };
    return publisher;
  }
  clientProxyUsers(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Users,
          routingKey,
          payload,
          timeout: 50000,
        }),
      );
    };
    return publisher;
  }
  clientProxyUInformation(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.UserInformation,
          routingKey,
          payload,
          timeout: 50000,
        }),
      );
    };
    return publisher;
  }
  clientProxyReason(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Reasons,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }
  clientProxyAgent(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Agents,
          routingKey,
          payload,
          timeout: 50000,
        }),
      );
    };
    return publisher;
  }

  clientPhyshic(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Psychic,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }
  clientProxyRoles(connection: AmqpConnection) {
    const publisher = <T>(routingKey: string, payload: any): Observable<T> => {
      return this.handlerResponse(
        connection.request<T>({
          exchange: Exchanges.Role,
          routingKey,
          payload,
          timeout: 10000,
        }),
      );
    };
    return publisher;
  }
}
