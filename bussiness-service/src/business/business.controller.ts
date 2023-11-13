import { Controller, HttpStatus } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { BusinessMessage, RabbitMQ } from 'src/common/Constants';
import { BusinessDTO, filterBusinessDTO } from 'src/common/dto/business.dto';
import { AgenciesService } from 'src/agencies/agencies.service';
import { BusinessService } from './business.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Business } from 'control-risk/schemas/business.schema';
import { SalariesService } from 'src/salaries/salaries.service';
import { Types } from 'mongoose';

function BusinessExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.BusinessQueue,
    routingKey: params.pattern,
  });
}
@Controller()
export class BusinessController {
  constructor(
    private readonly businessServices: BusinessService,
    private readonly agencyService: AgenciesService,
    private readonly salaryService: SalariesService,
  ) {}

  @BusinessExchange({ pattern: BusinessMessage.CREATE })
  create(@Payload() businessDto: BusinessDTO) {
    try {
      return this.businessServices.create(businessDto);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo crear el negocio',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.OVERVIEW_BUSINESS })
  async agentOverview(@Payload() payload: Partial<Business>) {
    let throwObject = {};
    try {
      const datos = (
        await this.businessServices.findOneByParams(payload)
      ).toJSON();
      const minimunSalary = await this.salaryService.findMinimumSalary();
      const contacts = await this.businessServices.findContacts(payload);
      if (datos)
        return Object.assign(datos, {
          minimumSalary: minimunSalary.amount,
          contacts,
        });
      throwObject = {
        status: HttpStatus.NOT_FOUND,
        log: datos,
        message: 'No se encontro ningún registro',
      };
    } catch (err) {
      throwObject = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        log: err,
        message: 'Error deconocido',
      };
    }
    throw new RpcException(throwObject);
  }
  // @BusinessExchange({ pattern: BusinessMessage.FIND_ALL })
  // async findAll() {
  //   try {
  //     return this.businessServices.findAll();
  //   } catch (error) {
  //     throw new RpcException({
  //       status: HttpStatus.NOT_FOUND,
  //       log: error,
  //       message: 'No se pudo encontrar los negocios',
  //     });
  //   }
  // }
  @BusinessExchange({ pattern: BusinessMessage.FIND_ALL })
  async findAll(@Payload() businessDto: filterBusinessDTO) {
    try {
      return this.businessServices.findWithFilter(businessDto);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }
  @BusinessExchange({ pattern: BusinessMessage.LIST_ALL })
  async listAll() {
    try {
      return { data: await this.businessServices.listAll() };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }
  @BusinessExchange({ pattern: BusinessMessage.FIND_ONE })
  async findOne(@Payload() id: string) {
    try {
      return this.businessServices.findOne(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar el negocio',
      });
    }
  }
  @BusinessExchange({ pattern: BusinessMessage.UPDATE })
  async update(@Payload() { id, business }: any) {
    try {
      return this.businessServices.update(id, business);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo actualizar el negocio',
      });
    }
  }
  @BusinessExchange({ pattern: BusinessMessage.DELETE })
  async deleteBusiness(@Payload() id: string) {
    try {
      return this.businessServices.inactiveBusiness(id);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        log: error,
        message: 'No se pudo eliminar el negocio',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.GET_STATISTICS })
  async getHeapStatistics(@Payload() businessId: string) {
    try {
      return this.businessServices.getIndicators(businessId);
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.LIST_AGENCIES })
  async listAgencies(@Payload() business: string) {
    try {
      return { data: await this.agencyService.listByBusiness(business) };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar los negocios',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.FIND_CONFIG })
  async findBusinessConfig(@Payload() business: string) {
    try {
      const minimunSalary = await this.salaryService.findMinimumSalary();
      const businessConfig = (
        await this.businessServices.findConfig(business)
      ).toJSON();
      return Object.assign(businessConfig, {
        minimunSalary: minimunSalary.amount,
      });
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo encontrar la empresa',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.UPDATE_CONFIG })
  updateBusinessConfig(@Payload() business: any) {
    try {
      const { id, ...payload } = business;
      return this.businessServices.update(id, payload);
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.GET_CONTACTS })
  getBusinessContacts(@Payload() business: any) {
    try {
      const { id } = business;
      return this.businessServices.findContacts({
        _id: new Types.ObjectId(id),
      });
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.GET_CONTACTS_TABLE })
  getBusinessContactsTableData(@Payload() business: any) {
    try {
      business._id = new Types.ObjectId(business.id);
      return this.businessServices.findContactsTable(business);
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.CREATE_CONTACT })
  createBusinessContacts(@Payload() contact: any) {
    try {
      const { bussiness, contactName, contactEmail, contactPhone } = contact;
      return this.businessServices.createContact({
        bussiness: !!bussiness ? new Types.ObjectId(bussiness) : null,
        contactName,
        contactEmail,
        contactPhone,
      });
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }

  @BusinessExchange({ pattern: BusinessMessage.UPDATE_CONTACT })
  updateBusinessContacts(@Payload() contact: any) {
    try {
      const { _id, contactName, contactEmail, contactPhone } = contact;
      return this.businessServices.updateContact(
        { _id: new Types.ObjectId(_id) },
        {
          contactName,
          contactEmail,
          contactPhone,
        },
      );
    } catch (error) {
      console.log(error.message, 'ERROR');
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: 'No se pudo actualizar las configuraciones de la empresa',
      });
    }
  }
}
