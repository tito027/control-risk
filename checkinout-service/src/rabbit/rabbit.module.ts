import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQ } from 'src/common/Constants';

const rabbitModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('AMQP_URL'),
    exchanges: [
      {
        name: RabbitMQ.CheckInOutQueue,
        type: 'topic',
      },
      {
        name: RabbitMQ.Entries,
        type: 'topic',
      },
      {
        name: 'amq.topic',
        type: 'topic',
      },
    ],
    connectionInitOptions: { wait: false },
    enableControllerDiscovery: true,
  }),
  inject: [ConfigService],
});
@Module({
  imports: [rabbitModule],
  exports: [rabbitModule],
})
export class RabbitModule {}
