import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business, BusinessSchema } from 'control-risk/schemas/business.schema';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { AgenciesModule } from 'src/agencies/agencies.module';
import { SalariesModule } from 'src/salaries/salaries.module';
import { Contact, ContactSchema } from 'control-risk/schemas/contact.schema';

@Module({
  imports: [
    AgenciesModule,
    SalariesModule,
    MongooseModule.forFeature([
      {
        name: Business.name,
        schema: BusinessSchema,
      },
      {
        name: Contact.name,
        schema: ContactSchema,
      },
    ]),
    RabbitModule,
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
