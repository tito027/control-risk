import {
  AmqpConnection,
  isRabbitContext,
  RabbitMQModule,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq';
import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  BaseRpcContext,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { Observable, Subscriber, throwError, observable } from 'rxjs';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { inspect } from 'util';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(ExceptionFilter.name);
  catch(exception: RpcException): any {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(message)}`);

    return message;

    // return throwError(() => exception.getError());
    /*     const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    this.logger.error(`Status: ${status} Error: ${JSON.stringify(message)}`);

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    }); */
  }
}
