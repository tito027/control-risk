import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ClientProxyControl} from "../common/proxy/client.proxy";
import {Observable} from "rxjs";
import {SchedulesMessage} from "../common/Constants";
import {ISchedules} from "../common/interfaces/ISchedules";
import {SchedulesDTO} from "../common/dto/schedules.dto";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly clientProxy: ClientProxyControl) {}
  private _clientProxySchedules = this.clientProxy.clientProxySchedules();

  @Post()
  create(@Body() schedules: SchedulesDTO): Observable<ISchedules>{
    return this._clientProxySchedules.send(SchedulesMessage.CREATE, schedules);
  }
  @Get()
  findAll(): Observable<ISchedules[]>{
    return this._clientProxySchedules.send(SchedulesMessage.FIND_ALL, '');
  }
  @Get('/find/one/:id')
  findOne(@Param('id') id: string): Observable<ISchedules> {
    return this._clientProxySchedules.send(SchedulesMessage.FIND_ONE, id);
  }
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() schedules: SchedulesDTO): Observable<ISchedules>{
    return this._clientProxySchedules.send(SchedulesMessage.UPDATE, { id, schedules });
  }
  @Delete('/delete/:id')
  delete(@Param('id') id: string, @Param('flag') flag: string){
    return this._clientProxySchedules.send(SchedulesMessage.DELETE, { id, flag });
  }
}
