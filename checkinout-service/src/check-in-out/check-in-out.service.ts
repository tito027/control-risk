import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AgencyService } from 'src/services/agency.service';
import { UserService } from 'src/services/user.service';
import { CheckInOut, CheckInOutDocument } from './check-in-out.schema';

@Injectable()
export class CheckInOutService {
  constructor(
    @InjectModel(CheckInOut.name)
    private readonly model: Model<CheckInOutDocument>,
    private readonly userService: UserService,
    private readonly agencyService: AgencyService,
  ) {}

  async create(checkInOutDTO: CheckInOut): Promise<CheckInOutDocument> {
    return new this.model({ ...checkInOutDTO }).save();
  }

  async findAll(): Promise<CheckInOutDocument[]> {
    return this.model
      .find({ active: true })
      .populate('user')
      .populate('physicalPosition')
      .populate('timeReason')
      .populate('positionReason');
  }

  async getLastOne(
    query: FilterQuery<CheckInOutDocument>,
  ): Promise<CheckInOutDocument> {
    const list = await this.model
      .find({ status: true, ...query })
      .sort({ createdAt: -1 })
      .limit(1);
    return list[0];
  }
  async findByCarnet(carnet: string): Promise<CheckInOutDocument[]> {
    return await this.model
      .find({ carnet, active: true })
      .populate('user')
      .populate('physicalPosition')
      .populate('timeReason')
      .populate('positionReason');
  }

  async findByFilter(
    carnet,
    nombre,
    posicion,
    fechaInicio,
    fechaFin,
    pag,
    user,
    dto,
  ): Promise<{ data: any[]; totalRegistros: number }> {
    const npagina = (dto.pagination.currentPage - 1) * dto.pagination.perPage;
    const userData = await this.userService.findById(user);
    let filterMatch = {};
    let $and = [];
    console.group('**** prueba ****');
    console.log(userData);
    console.groupEnd();
    if (userData.role.name === 'supervisor') {
      const ids = await this.agencyService.findIdsBySupervisor(user);
      const supervisorMatch = {
        $expr: {
          $in: ['$agencydata._id', ids],
        },
      };
      $and.push(supervisorMatch);
    }
    if (!dto.seeAll) {
      $and.push({ active: true });
    }
    if (dto.params.carnet) {
      let $or = [];
      dto.params.carnet.forEach((element) => {
        $or.push({ carnet: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    if (dto.params.accion) {
      dto.params.accion.forEach((element) => {
        if (element === 'Entrada') {
          $and.push({ accion: true });
        } else if (element === 'Salida') {
          $and.push({ accion: false });
        }
      });
    }
    if (dto.params.nombre) {
      let $or = [];
      dto.params.nombre.forEach((element) => {
        $or.push({ nombres: new RegExp(element, 'i') });
        $or.push({ apellidos: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    if (dto.params.fecha) {
      let $or = [];
      dto.params.fecha.forEach((element) => {
        console.log(element[0]);
        console.log(element[1]);
        $or.push({
          fecha: {
            $gte: new Date(element[0]),
            $lte: new Date(element[1]),
          },
        });
      });
      $and.push({ $or: $or });
    }
    if (dto.params.posicion) {
      let $or = [];
      dto.params.posicion.forEach((element) => {
        $or.push({ nombreEmpresa: new RegExp(element, 'i') });
        $or.push({ nombreAgencia: new RegExp(element, 'i') });
        $or.push({ nombrePosicion: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    const nothing = 'ninguna';
    if (dto.params.razonTiempo) {
      let $or = [];
      dto.params.razonTiempo.forEach((element) => {
        if (nothing.includes(element)) {
          $or.push({ timeReason: null });
        }
        $or.push({ razonTiempo: new RegExp(element, 'i') });
      });
      console.log($or);
      $and.push({ $or: $or });
    }
    if (dto.params.razonPosicion) {
      let $or = [];
      dto.params.razonPosicion.forEach((element) => {
        if (nothing.includes(element)) {
          $or.push({ positionReason: null });
        }
        $or.push({ razonPosicion: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    if ($and.length > 0) filterMatch = { $and };
    const queryagg = [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userdata',
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'userdata.userInformation',
          foreignField: '_id',
          as: 'userinformationdata',
        },
      },
      {
        $lookup: {
          from: 'physicalpositions',
          localField: 'physicalPosition',
          foreignField: '_id',
          as: 'positiondata',
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: 'positiondata.agency',
          foreignField: '_id',
          as: 'agencydata',
        },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'agencydata.business',
          foreignField: '_id',
          as: 'businessdata',
        },
      },
      {
        $unwind: {
          path: '$agencydata',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'reasons',
          localField: 'positionReason',
          foreignField: '_id',
          as: 'positionReasonData',
        },
      },
      {
        $lookup: {
          from: 'reasons',
          localField: 'timeReason',
          foreignField: '_id',
          as: 'timeReasonData',
        },
      },
      {
        $project: {
          nombres: '$userinformationdata.name',
          apellidos: '$userinformationdata.lastname',
          carnet: '$userdata.carnet',
          accion: '$status',
          fecha: '$createdAt',
          hora: { $hour: '$createdAt' },
          nombreEmpresa: '$businessdata.name',
          nombreAgencia: '$agencydata.name',
          nombrePosicion: '$positiondata.name',
          razonTiempo: '$timeReasonData.reason',
          razonPosicion: '$positionReasonData.reason',
          active: '$active',
        },
      },
      {
        $match: {
          ...filterMatch,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: npagina }, { $limit: dto.pagination.perPage }],
        },
      },
    ];
    const modelos = await this.model.aggregate(queryagg);
    const datafinal = {
      data: modelos[0].data,
      totalRegistros: modelos[0].metadata[0]?.total ?? 0,
    };
    return datafinal;
  }
}
