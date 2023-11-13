import PdfPrinter from 'pdfmake';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import path from 'path';
import { generateCarnet } from './carnet.pdfmake.schema';
import { PhysicalPosition } from 'control-risk/schemas/physicalPosition.schema';
import { UserInformation } from 'control-risk/schemas/userInformation.schema';
import { User, UserDocument } from 'control-risk/schemas/user.schema';
import { createWriteStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import { AgentStatus } from 'control-risk/schemas/agentStatus.schema';
import * as bcrypt from 'bcrypt';
import { getFilters, getStrictMatchs } from 'src/common/utils';
import { BasePayload } from 'src/common/dto/default.dto';
import { inspect } from 'util';
import { UsersInformationsService } from 'src/users-informations/users-informations.service';
import { AssignmentHistoryService } from 'src/assignment-history/assignmentHistory.service';

export type payloadDocument = UserDocument & {
  userinfodata: UserInformation;
  physicaldata: PhysicalPosition;
  agencydata: PhysicalPosition;
  businessesdata: PhysicalPosition;
  agentstatus: AgentStatus;
  createdAt?: Date;
  updateAt?: Date;
};
export type payloadUserDocument = UserDocument & {
  userinfodata: UserInformation;
  createdAt?: Date;
  updateAt?: Date;
};
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
    private readonly configService: ConfigService<IConfig>,
    private readonly userInformationService: UsersInformationsService,
    private readonly assignmentHistoryService: AssignmentHistoryService,
  ) {}

  update(
    query: {
      [k in keyof UserDocument]?: any;
    },
    params: { [k in keyof UserDocument]?: any },
  ): any {
    return this.model.updateOne<User>(query, {
      $set: params,
    });
  }
  findAll() {
    console.log(this.model.find({ active: true }));
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  findByCarnet(carnet: string) {
    return this.model.findOne({ carnet }).populate('userInformation');
  }

  findByCarnets(carnets) {
    // Utilizamos la función "find" con "$in" para buscar varios documentos por _id

    return this.model
      .find({ carnet: { $in: JSON.parse(carnets) }, image: true })
      .populate('userInformation');
  }

  async findByUserInfoId(userInfoId: string) {
    return await this.model.findOne({
      userInformation: userInfoId,
    });
  }

  generatePdf(agent: UserDocument): Promise<string> {
    return new Promise(async (res, rej) => {
      const body = await generateCarnet(agent, {
        rootPath: this.configService.get('FILE_PATH'),
      });
      const pdfName = `${new Date().toISOString().split('T')[0]}_${
        agent.username
      }.pdf`;
      const writeFile = createWriteStream(
        path.join(this.configService.get('FILE_PATH'), pdfName),
      );
      const fonts = {
        Roboto: {
          normal: path.join(path.resolve(), 'assets/fonts/Roboto-Regular.ttf'),
          bold: path.join(path.resolve(), 'assets/fonts/Roboto-Medium.ttf'),
          bolditalics: path.join(
            path.resolve(),
            'assets/fonts/Roboto-BoldItalic.ttf',
          ),
        },
      };
      const printer = new PdfPrinter(fonts);
      const pdfDoc = printer.createPdfKitDocument(body);
      pdfDoc.pipe(writeFile);
      writeFile.on('finish', () => console.log('Success writing pdf carnet!'));
      writeFile.on('error', rej);
      pdfDoc.on('end', () => res(pdfName));
      pdfDoc.end();
    });
  }
  generateMassivePdf(agents: any[]): Promise<any[]> {
    console.log(agents + ' agents');
    return new Promise(async (resolve, reject) => {
      const pdfNames = [];

      for (const agent of agents) {
        try {
          console.log(agent);
          const body = await generateCarnet(agent, {
            rootPath: this.configService.get('FILE_PATH'),
          });

          const pdfName = `${new Date().toISOString().split('T')[0]}_${
            agent.username
          }.pdf`;

          const writeFile = createWriteStream(
            path.join(this.configService.get('FILE_PATH'), pdfName),
          );

          const fonts = {
            Roboto: {
              normal: path.join(
                path.resolve(),
                'assets/fonts/Roboto-Regular.ttf',
              ),
              bold: path.join(path.resolve(), 'assets/fonts/Roboto-Medium.ttf'),
              bolditalics: path.join(
                path.resolve(),
                'assets/fonts/Roboto-BoldItalic.ttf',
              ),
            },
          };

          const printer = new PdfPrinter(fonts);
          const pdfDoc = printer.createPdfKitDocument(body);

          pdfDoc.pipe(writeFile);

          writeFile.on('finish', () => {
            console.log(`Success writing pdf carnet for ${agent.username}!`);
            pdfNames.push(pdfName);

            // Si hemos creado PDFs para todos los agentes, resolvemos la promesa
            if (pdfNames.length === agents.length) {
              resolve(pdfNames);
            }
          });

          writeFile.on('error', (err) => {
            console.error(`Error writing PDF for ${agent.username}: ${err}`);
            reject(err);
          });

          pdfDoc.end();
        } catch (err) {
          console.error(`Error generating PDF for ${agent.username}: ${err}`);
          reject(err);
        }
      }
    });
  }

  async create(
    userinfo: ObjectId,
    carnet: string,
    username: string,
    password: string,
    role: ObjectId,
    createdBy: ObjectId,
  ): Promise<UserDocument> {
    const pass = bcrypt.hashSync(password, 12);
    const data = {
      username: username,
      active: false,
      carnet: carnet,
      password: pass,
      role: role,
      userInformation: userinfo,
      createdBy: createdBy,
    };
    return new this.model({ ...data }).save();
  }

  async findDuplicate(carnet: string): Promise<{ carnet: boolean }> {
    let message = {
      carnet: false,
    };
    const datacarnet = await this.model.find({ carnet: carnet });
    if (datacarnet.length > 0) {
      message = { ...message, carnet: true };
    }
    return message;
  }

  async updateAgentSatus(userId: string): Promise<UserDocument> {
      return this.model.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            active: true,
          },
        },
      );
  }

  async inactiveAgent(userId: string): Promise<UserDocument> {
    return this.model.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          active: false,
        },
      },
    );
  }

  async agencyById(userId: string): Promise<any> {
    const queryagg = [
      {
        $lookup: {
          from: 'userinformations',
          localField: 'userInformation',
          foreignField: '_id',
          as: 'userinfodata',
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
    ];
    const dato = await this.model.aggregate(queryagg);
    return dato;
  }

  async agencyList(
    dto: BasePayload<UserDocument>,
  ): Promise<{ data: any[]; totalRegistros: number }> {
    const npagina = (dto.pagination.currentPage - 1) * dto.pagination.perPage;
    const queryStrict = getStrictMatchs(dto.strict ?? {});
    if (dto.params['nombre'])
      dto.params['nombre'] = dto.params['nombre'].map((name) =>
        name.replace(' ', '|'),
      );
    const matchFilters = getFilters(dto.params);

    if (!dto.seeAll) {
      matchFilters.push({ active: true });
    }

    try {
      const queryagg = [
        {
          $match: {
            $and: queryStrict,
          },
        },
        {
          $lookup: {
            from: 'userinformations',
            localField: 'userInformation',
            foreignField: '_id',
            as: 'userinfodata',
          },
        },
        { $unwind: '$userinfodata' },
        {
          $lookup: {
            from: 'agencies',
            localField: 'assignment.agency',
            foreignField: '_id',
            as: 'agencydata',
          },
        },
        {
          $lookup: {
            from: 'businesses',
            localField: 'agencydata.business',
            foreignField: '_id',
            as: 'businessesdata',
          },
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'roledata',
          },
        },
        {
          $lookup: {
            from: 'agentstatuses',
            localField: '_id',
            foreignField: 'user',
            pipeline: [
              {
                $match: { active: true },
              },
            ],
            as: 'agentstatus',
          },
        },
        {
          $project: {
            carnet: '$carnet',
            nombre: {
              $concat: ['$userinfodata.name', ' ', '$userinfodata.lastname'],
            },
            agencia: '$agencydata.name',
            empresa: '$businessesdata.name',
            active: '$active',
            userinfoid: '$userinfodata._id',
            nextStep: '$userinfodata.nextStep',
            rol: '$roledata.code',
            status: '$agentstatus.status',
          },
        },
        {
          $match: {
            $and: matchFilters,
            rol: { $gte: 8, $lte: 14 },
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: npagina }, { $limit: dto.pagination.perPage }],
          },
        },
      ];
      console.log(JSON.stringify(queryagg));
      const modelos = await this.model.aggregate(queryagg);
      const datafinal = {
        data: modelos[0].data,
        totalRegistros: modelos[0].metadata[0]?.total
          ? modelos[0].metadata[0].total
          : 0,
      };
      return datafinal;
    } catch (error) {
      console.error(error);
    }
  }
  async agencyOverview(carnet): Promise<payloadDocument> {
    let matchFilters = {};
    if (carnet)
      matchFilters = { ...matchFilters, carnet: new RegExp(carnet, 'i') };
    const queryagg = [
      {
        $lookup: {
          from: 'userinformations',
          localField: 'userInformation',
          foreignField: '_id',
          as: 'userinfodata',
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: 'assignment.agency',
          foreignField: '_id',
          as: 'agencydata',
        },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'agencydata.business',
          foreignField: '_id',
          as: 'businessesdata',
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roledata',
        },
      },
      {
        $lookup: {
          from: 'agentstatuses',
          localField: '_id',
          foreignField: 'user',
          pipeline: [
            {
              $match: { active: true },
            },
          ],
          as: 'agentstatus',
        },
      },
      {
        $match: {
          ...matchFilters,
          'roledata.name': { $nin: ['administrator'] },
        },
      },
    ];
    const modelos = await this.model.aggregate(queryagg);
    return modelos[0];
  }

  async listSupervisors() {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roledata',
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'userInformation',
          foreignField: '_id',
          as: 'userData',
        },
      },
      {
        $match: {
          'roledata.name': 'supervisor',
          active: true,
        },
      },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $arrayElemAt: ['$userData.name', 0] },
              ' ',
              { $arrayElemAt: ['$userData.lastname', 0] },
            ],
          },
          value: '$_id',
        },
      },
    ]);
  }

  async updateUserActive(id, active) {
    return this.model.findByIdAndUpdate(id, { active: active });
  }

  async findAgent(id: string) {
    return this.model
      .findById(id)
      .populate('assignment.agency')
      .populate('userInformation');
  }

  async updateAssigment(
    id: string,
    agent: any,
    salary: number,
    createdBy: string,
  ) {
    const user = await this.model.findByIdAndUpdate(id, { ...agent });
    await this.userInformationService.update(
      { _id: user.userInformation },
      { salary },
    );
    await this.assignmentHistoryService.create({
      user: id,
      agency: agent['assignment.agency'],
      role: agent.role,
      salary,
      createdBy,
    });
    return user;
  }
}
