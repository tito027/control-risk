import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { Payload, RpcException } from '@nestjs/microservices';
import { CheckInOutMessage, RabbitMQ } from 'src/common/Constants';
import { distance } from 'src/common/utils';
import { ReasonsService } from 'src/reasons/reasons.service';
import { PhysicalPositionService } from 'src/services/physicialPosition.service';
import { UserService } from 'src/services/user.service';
import { DateTime, Duration } from 'luxon';
import {
  CheckInOutDTO,
  HistoryCheckInOutDTO,
  TryCheckInOutDTO,
} from './check-in-out.dto';
import { CheckInOut, CheckInOutDocument } from './check-in-out.schema';
import { CheckInOutService } from './check-in-out.service';
import * as bcrypt from 'bcrypt';
import { EntriesService } from 'src/entries/entries.service';
import { EntriesDocument } from 'control-risk/schemas/entries.schema';
import { Workday, WorkdayDocument } from 'control-risk/schemas/workday.schema';
import { AgencyDocument } from 'control-risk/agency.schema';
import { User } from 'control-risk/schemas/user.schema';

function CheckInOutExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.CheckInOutQueue,
    routingKey: params.pattern,
  });
}

@Controller('check-in-out')
export class CheckInOutController {
  constructor(
    private readonly checkInOutService: CheckInOutService,
    private readonly userService: UserService,
    private readonly entriesService: EntriesService,
    private readonly reasonService: ReasonsService,
    private readonly physicalPositionService: PhysicalPositionService,
  ) {}

  validateCheck(workday: Workday, user: User) {
    let badHour = false;
    try {
      // Get pattern Date
      const initDate = DateTime.fromJSDate(workday.startDate);
      const diffDate = DateTime.now().diff(initDate, ['days']);
      const patternDate =
        (Math.ceil(diffDate.days) % workday.days.length ||
          workday.days.length) - 1;
      // Get Schedule

      const now = Duration.fromObject(
        DateTime.now().setZone('UTC-6').toObject(),
      );
      const schedule = { diff: 2400, key: '' };
      workday.days[patternDate]
        .filter((k) => k.toUpperCase() !== 'L')
        .forEach((key) => {
          const diff = now.minus({
            hours: Math.floor(
              workday.schedule[key][!user.working ? 'checkIn' : 'checkOut'] /
                100,
            ),
            minutes: Math.floor(
              workday.schedule[key][!user.working ? 'checkIn' : 'checkOut'] %
                100,
            ),
          });

          if (
            Math.abs(diff.hours) * 60 + Math.abs(diff.minutes) <
            schedule.diff
          )
            (schedule.diff =
              Math.abs(diff.hours) * 60 + Math.abs(diff.minutes)),
              (schedule.key = key);
        });

      if (schedule.diff > Number.parseInt(process.env.TIME_TOLERANCE))
        badHour = true;

      return { badHour, schedule, patternDate };
    } catch (error) {
      console.error(error);
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: error,
        message: `Error validando entrada`,
      });
    }
  }

  @CheckInOutExchange({ pattern: CheckInOutMessage.TRY_CHECK_IN_OUT })
  async tryCheckInOut(@Payload() checkInOutDTO: TryCheckInOutDTO) {
    let badHour = false,
      badPosition = false;
    const userCode = {
      carnet: checkInOutDTO.user,
    };

    if (!userCode.carnet)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        log: `Token invalido, no posee el carnet. En el servicio de check in/out, en la función de ${CheckInOutMessage.TRY_CHECK_IN_OUT}`,
        message: `El token no posee el carnet`,
      });

    const user = await this.userService.findByCarnet(userCode.carnet);

    if (!user)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: `No se ha encontrado un usuario con el carnet ${userCode.carnet} en el servicio de check in/out, en la función de ${CheckInOutMessage.TRY_CHECK_IN_OUT}`,
        message: `No se ha encontrado un usuario con el carnet ${userCode.carnet}`,
      });

    const physicalPosition = await this.physicalPositionService.findById(
      checkInOutDTO.physicalPosition,
    );

    /*************************************************/
    /**  Determinando si la posición es incorrecta  **/
    /*************************************************/
    if (
      physicalPosition.agency.toString() !==
      (user.assignment?.agency as AgencyDocument)?._id.toString()
    )
      badPosition = true;

    // Calculando la distancia en km dada 2 coordenadas geograficas
    const distanc = distance(
      checkInOutDTO.latitude,
      checkInOutDTO.longitude,
      (user.assignment.agency as AgencyDocument).latitude,
      (user.assignment.agency as AgencyDocument).longitude,
    );

    if (distanc > Number.parseFloat(process.env.DISTANCE_TOLERANCE))
      badPosition = true;

    /***********************************************************/
    /** Determinando si el checkinout es valido en el horario **/
    /***********************************************************/

    const workday: Workday = user.assignment.workday as Workday;
    badHour = this.validateCheck(workday, user).badHour;

    return {
      username: user.username,
      picture: user.userInformation.picture,
      type: !user.working ? 'checkIn' : 'checkOut',
      inSite: !badPosition,
      inTime: !badHour,
      user: user,
    };
  }

  @CheckInOutExchange({ pattern: CheckInOutMessage.CHECK_IN_OUT })
  async checkInOut(@Payload() checkInOutDTO: CheckInOutDTO) {
    const userCode = {
      carnet: checkInOutDTO.user,
    };

    if (!userCode.carnet)
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        log: `Token invalido, no posee el carnet. En el servicio de check in/out, en la función de ${CheckInOutMessage.CHECK_IN_OUT}`,
        message: `El token no posee el carnet`,
      });

    const user = await this.userService.findByCarnet(userCode.carnet);

    if (!user)
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        log: `No se ha encontrado un usuario con el carnet ${userCode.carnet} en el servicio de check in/out, en la función de ${CheckInOutMessage.CHECK_IN_OUT}`,
        message: `No se ha encontrado un usuario con el carnet ${userCode.carnet}`,
      });

    const isCorrectPassword = await bcrypt.compare(
      checkInOutDTO.password,
      user.password,
    );
    if (!isCorrectPassword)
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        log: `Contraseña incorrecta en el servicio de check in/out, en la función de ${CheckInOutMessage.CHECK_IN_OUT}`,
        message: `Credenciales incorrectas`,
      });

    const checkInOut = new CheckInOut() as CheckInOutDocument;
    checkInOut.user = user._id;
    checkInOut.physicalPosition = checkInOutDTO.physicalPosition;
    checkInOut.latitude = checkInOutDTO.latitude;
    checkInOut.longitude = checkInOutDTO.longitude;
    if (checkInOutDTO.reasonSite) {
      const reason = await this.reasonService.findByIdAndPosition(
        checkInOutDTO.reasonSite,
      );
      if (reason) checkInOut.positionReason = checkInOutDTO.reasonSite as any;
    }
    if (checkInOutDTO.reasonTime) {
      const reason = await this.reasonService.findByIdAndTime(
        checkInOutDTO.reasonTime,
      );
      if (reason) checkInOut.timeReason = checkInOutDTO.reasonTime as any;
    }
    checkInOut.status = !user.working;
    checkInOut.createdBy = user._id;

    let entry: EntriesDocument;
    const check: CheckInOutDocument = await this.checkInOutService.create(
      checkInOut,
    );
    const workday: Workday = user.assignment.workday as Workday;

    const { patternDate, schedule } = this.validateCheck(workday, user);

    /*** Save Entry ***/
    if (user.working) {
      const checkIn = await this.checkInOutService.getLastOne({
        user: new Types.ObjectId(user._id.toString()),
      });
      entry = await this.entriesService.findOne({
        checkIn: checkIn._id,
      });
      entry.checkOut = check._id;
      entry.save();
    } else {
      await this.entriesService.create({
        createdBy: user._id,
        checkIn: check._id,
        validated: false,
        schedule: (user.assignment.workday as WorkdayDocument)._id,
        checkData: {
          day: patternDate,
          key: schedule.key ?? 'L',
        },
      });
    }
    this.userService.changeWorkinStatusByCarnet(user.carnet, !user.working);
    return check;
  }

  @CheckInOutExchange({ pattern: CheckInOutMessage.FIND_ALL })
  async checkInOutHistory(@Payload() CheckInOutDTO: HistoryCheckInOutDTO) {
    try {
      const datos = await this.checkInOutService.findByFilter(
        CheckInOutDTO.carnet,
        CheckInOutDTO.nombre,
        CheckInOutDTO.posicion,
        CheckInOutDTO.fechaInicio,
        CheckInOutDTO.fechaFin,
        CheckInOutDTO.pag,
        CheckInOutDTO.user,
        CheckInOutDTO,
      );
      const datofinal = [];
      datos.data.forEach((elements) => {
        const estado = elements.accion == true ? 'Entrada' : 'Salida';
        const fecha = elements.fecha.toISOString().split('T')[0];
        const hora = elements.fecha.toISOString().split('T')[1].split('.')[0];
        const data = {
          nombre: `${elements.nombres} ${elements.apellidos}`,
          carnet: elements.carnet[0],
          accion: estado,
          fecha: fecha,
          hora: hora,
          posicion: `${elements.nombreEmpresa} - ${elements.nombreAgencia} (${elements.nombrePosicion})`,
          razonTiempo:
            elements.razonTiempo[0] == null
              ? 'Ninguna'
              : elements.razonTiempo[0],
          razonPosicion:
            elements.razonPosicion[0] == null
              ? 'Ninguna'
              : elements.razonPosicion[0],
        };
        datofinal.push(data);
      });
      return {
        data: datofinal,
        totalRegistros: datos.totalRegistros,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
