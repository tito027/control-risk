import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { RabbitMQ, UserInformationsMessage } from 'src/common/Constants';
import { UserInformationDocument } from 'control-risk/schemas/userInformation.schema';
import { UsersInformationsService } from './users-informations.service';

function UsersIExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.UserInfQueue,
    routingKey: params.pattern,
  });
}

@Controller('users-informations')
export class UsersInformationsController {
  constructor(
    private readonly usersInformationsService: UsersInformationsService,
  ) {}

  @UsersIExchange({ pattern: UserInformationsMessage.UPDATE_DOC })
  async updateDoc(
    @Payload()
    {
      id,
      payload,
    }: {
      id: UserInformationDocument['_id'];
      payload: UserInformationDocument['docs'][0];
    },
  ) {
    const user = await this.usersInformationsService.findById(id);
    const index = user.docs.findIndex((doc) => doc.name === payload.name);
    if (index > -1) user.docs[index] = payload;
    else user.docs.push(payload);
    return await user.save();
  }
  @UsersIExchange({ pattern: UserInformationsMessage.UPDATE })
  async update(
    @Payload()
    {
      query,
      params,
    }: {
      params: Partial<UserInformationDocument>;
      query: Partial<UserInformationDocument>;
    },
  ) {
    const resp = await this.usersInformationsService.update(query, params);
    return resp.modifiedCount > 0 ? params : {};
  }
}
