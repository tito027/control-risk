import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReasonsModule } from 'src/reasons/reasons.module';
import { Agency, AgencySchema } from 'control-risk/schemas/agency.schema';
import {
  PhysicalPosition,
  PhysicalPositionSchema,
} from 'control-risk/schemas/physicalPosition.schema';
import { Role, RoleSchema } from 'control-risk/schemas/rol.schema';
import { User, UserSchema } from 'control-risk/schemas/user.schema';
import {
  UserInformation,
  UserInformationSchema,
} from 'control-risk/schemas/userInformation.schema';
import { Workday, WorkdaySchema } from 'control-risk/schemas/workday.schema';
import { AgencyService } from 'src/services/agency.service';
import { PhysicalPositionService } from 'src/services/physicialPosition.service';
import { UserService } from 'src/services/user.service';
import { CheckInOutController } from './check-in-out.controller';
import { CheckInOut, CheckInOutSchema } from './check-in-out.schema';
import { CheckInOutService } from './check-in-out.service';
import { EntriesModule } from 'src/entries/entries.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CheckInOut.name, schema: CheckInOutSchema },
      { name: User.name, schema: UserSchema },
      { name: PhysicalPosition.name, schema: PhysicalPositionSchema },
      { name: UserInformation.name, schema: UserInformationSchema },
      { name: Agency.name, schema: AgencySchema },
      { name: Workday.name, schema: WorkdaySchema },
      { name: Agency.name, schema: AgencySchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    ReasonsModule,
    EntriesModule,
  ],
  controllers: [CheckInOutController],
  providers: [
    CheckInOutService,
    UserService,
    PhysicalPositionService,
    AgencyService,
  ],
})
export class CheckInOutModule {}
