import { Module } from '@nestjs/common';
import { UsersInformationsService } from './users-informations.service';
import { UsersInformationsController } from './users-informations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserInformation,
  UserInformationSchema,
} from 'control-risk/schemas/userInformation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserInformation.name,
        schema: UserInformationSchema,
      },
    ]),
  ],
  controllers: [UsersInformationsController],
  providers: [UsersInformationsService],
  exports: [UsersInformationsService],
})
export class UsersInformationsModule {}
