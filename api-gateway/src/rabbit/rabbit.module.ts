import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Exchanges } from 'src/common/Constants';

const rabbitModule = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('AMQP_URL'),
    exchanges: [
      {
        name: Exchanges.Administration,
        type: 'topic',
      },
      {
        name: Exchanges.Reasons,
        type: 'topic',
      },
      {
        name: Exchanges.Agencies,
        type: 'topic',
      },
      {
        name: Exchanges.Business,
        type: 'topic',
      },
      {
        name: Exchanges.CheckInOut,
        type: 'topic',
      },
      {
        name: Exchanges.Physicalposition,
        type: 'topic',
      },
      {
        name: Exchanges.Schedules,
        type: 'topic',
      },
      {
        name: Exchanges.Users,
        type: 'topic',
      },
      {
        name: Exchanges.UserInformation,
        type: 'topic',
      },
      {
        name: Exchanges.Entries,
        type: 'topic',
      },
      {
        name: Exchanges.Role,
        type: 'topic',
      },
      {
        name: Exchanges.Salaries,
        type: 'topic',
      },
      {
        name: Exchanges.Payroll,
        type: 'topic',
      },
      {
        name: Exchanges.Agents,
        type: 'topic',
      },
    ],
    connectionInitOptions: { wait: false },
  }),
  inject: [ConfigService],
});
@Module({
  imports: [rabbitModule],
  exports: [rabbitModule],
})
export class RabbitModule {}
