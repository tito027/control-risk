import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  CreateAgentS1DTO,
  CreateAgentS2DTO,
  CreateAgentS3DTO,
  CreateAgentS4DTO,
  CreateAgentS5DTO,
  CreateAgentS6DTO,
  CreateAgentS7DTO,
  CreateAgentS8DTO,
} from 'src/common/dto/userInformation.dto';
import {
  UserInformation,
  UserInformationDocument,
} from 'control-risk/schemas/userInformation.schema';

@Injectable()
export class UsersInformationsService {
  constructor(
    @InjectModel(UserInformation.name)
    private readonly model: Model<UserInformationDocument>,
  ) {}

  async create(
    userInformation: CreateAgentS1DTO,
  ): Promise<UserInformationDocument> {
    return new this.model({ ...userInformation }).save();
  }

  async creates2(
    CreateAgentS2DTO: CreateAgentS2DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS2DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS2DTO.userInfoId },
        {
          $set: {
            height: CreateAgentS2DTO.height,
            weight: CreateAgentS2DTO.weight,
            face: CreateAgentS2DTO.face,
            lips: CreateAgentS2DTO.lips,
            eyesColor: CreateAgentS2DTO.eyesColor,
            nose: CreateAgentS2DTO.nose,
            hairTypeColor: CreateAgentS2DTO.hairTypeColor,
            skinColor: CreateAgentS2DTO.skinColor,
            specialSings: CreateAgentS2DTO.specialSings,
            tattos: CreateAgentS2DTO.tattos,
            job: CreateAgentS2DTO.job,
            salary: CreateAgentS2DTO.salary,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS2DTO.userInfoId },
        {
          $set: {
            height: CreateAgentS2DTO.height,
            weight: CreateAgentS2DTO.weight,
            face: CreateAgentS2DTO.face,
            lips: CreateAgentS2DTO.lips,
            eyesColor: CreateAgentS2DTO.eyesColor,
            nose: CreateAgentS2DTO.nose,
            hairTypeColor: CreateAgentS2DTO.hairTypeColor,
            skinColor: CreateAgentS2DTO.skinColor,
            specialSings: CreateAgentS2DTO.specialSings,
            tattos: CreateAgentS2DTO.tattos,
            job: CreateAgentS2DTO.job,
            salary: CreateAgentS2DTO.salary,
            nextStep: CreateAgentS2DTO.nextStep,
          },
        },
      );
    }
  }

  async creates3(
    CreateAgentS3DTO: CreateAgentS3DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS3DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS3DTO.userInfoId },
        {
          $set: {
            master: CreateAgentS3DTO.master,
            university: CreateAgentS3DTO.university,
            certified: CreateAgentS3DTO.certified,
            highSchool: CreateAgentS3DTO.highSchool,
            thirdCycle: CreateAgentS3DTO.thirdCycle,
            secondCycle: CreateAgentS3DTO.secondCycle,
            firstCycle: CreateAgentS3DTO.firstCycle,
            previousJob: CreateAgentS3DTO.previousJob,
            militaryService: CreateAgentS3DTO.militaryService,
            currentlyStudying: CreateAgentS3DTO.currentlyStudying,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS3DTO.userInfoId },
        {
          $set: {
            master: CreateAgentS3DTO.master,
            university: CreateAgentS3DTO.university,
            certified: CreateAgentS3DTO.certified,
            highSchool: CreateAgentS3DTO.highSchool,
            thirdCycle: CreateAgentS3DTO.thirdCycle,
            secondCycle: CreateAgentS3DTO.secondCycle,
            firstCycle: CreateAgentS3DTO.firstCycle,
            previousJob: CreateAgentS3DTO.previousJob,
            militaryService: CreateAgentS3DTO.militaryService,
            currentlyStudying: CreateAgentS3DTO.currentlyStudying,
            nextStep: CreateAgentS3DTO.nextStep,
          },
        },
      );
    }
  }

  async creates4(
    CreateAgentS4DTO: CreateAgentS4DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS4DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS4DTO.userInfoId },
        {
          $set: {
            computerKnowledge: CreateAgentS4DTO.computerKnowledge,
            englishKnowledge: CreateAgentS4DTO.englishKnowledge,
            otherSkills: CreateAgentS4DTO.otherSkills,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS4DTO.userInfoId },
        {
          $set: {
            computerKnowledge: CreateAgentS4DTO.computerKnowledge,
            englishKnowledge: CreateAgentS4DTO.englishKnowledge,
            otherSkills: CreateAgentS4DTO.otherSkills,
            nextStep: CreateAgentS4DTO.nextStep,
          },
        },
      );
    }
  }

  async creates5(
    CreateAgentS5DTO: CreateAgentS5DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS5DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS5DTO.userInfoId },
        {
          $set: {
            workHistory: CreateAgentS5DTO.workHistory,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS5DTO.userInfoId },
        {
          $set: {
            workHistory: CreateAgentS5DTO.workHistory,
            nextStep: CreateAgentS5DTO.nextStep,
          },
        },
      );
    }
  }

  async creates6(
    CreateAgentS6DTO: CreateAgentS6DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS6DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS6DTO.userInfoId },
        {
          $set: {
            familyReferences: CreateAgentS6DTO.familyReferences,
            personalReferences: CreateAgentS6DTO.personalReferences,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS6DTO.userInfoId },
        {
          $set: {
            familyReferences: CreateAgentS6DTO.familyReferences,
            personalReferences: CreateAgentS6DTO.personalReferences,
            nextStep: CreateAgentS6DTO.nextStep,
          },
        },
      );
    }
  }

  async creates7(
    CreateAgentS7DTO: CreateAgentS7DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS7DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS7DTO.userInfoId },
        {
          $set: {
            familyRelationship: CreateAgentS7DTO.familyRelationship,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS7DTO.userInfoId },
        {
          $set: {
            familyRelationship: CreateAgentS7DTO.familyRelationship,
            nextStep: CreateAgentS7DTO.nextStep,
          },
        },
      );
    }
  }

  async creates8(
    CreateAgentS8DTO: CreateAgentS8DTO,
  ): Promise<UserInformationDocument> {
    if (CreateAgentS8DTO.isEdit) {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS8DTO.userInfoId },
        {
          $set: {
            cohabitant: CreateAgentS8DTO.cohabitant,
          },
        },
      );
    } else {
      return this.model.findOneAndUpdate(
        { _id: CreateAgentS8DTO.userInfoId },
        {
          $set: {
            cohabitant: CreateAgentS8DTO.cohabitant,
          },
          $unset: {
            nextStep: 1,
          },
        },
      );
    }
  }

  async edits1(
    editAgentS1: CreateAgentS1DTO,
  ): Promise<UserInformationDocument> {
    return this.model.findOneAndUpdate(
      { _id: editAgentS1.userId },
      {
        $set: {
          name: editAgentS1.name,
          lastname: editAgentS1.lastname,
          address: editAgentS1.address,
          municipality: editAgentS1.municipality,
          department: editAgentS1.department,
          birthdate: editAgentS1.birthdate,
          birthplace: editAgentS1.birthplace,
          gender: editAgentS1.gender,
          allergic: editAgentS1.allergic,
          homePhone: editAgentS1.homePhone,
          cellPhone: editAgentS1.cellPhone,
          profession: editAgentS1.profession,
          afpType: editAgentS1.afpType,
          dui: editAgentS1.dui,
          expeditionDate: editAgentS1.expeditionDate,
          expeditionPlace: editAgentS1.expeditionPlace,
          isss: editAgentS1.isss,
          afpNup: editAgentS1.afpNup,
          ipsfa: editAgentS1.ipsfa,
          maritalStatus: editAgentS1.maritalStatus,
          driverLicense: editAgentS1.driverLicense,
          class: editAgentS1.class,
          weaponLicense: editAgentS1.weaponLicense,
          expirationWeaponLicense: editAgentS1.expirationWeaponLicense,
          bloodType: editAgentS1.bloodType,
          ansp: editAgentS1.ansp,
          anspDate: editAgentS1.anspDate,
          anspNo: editAgentS1.anspNo,
          carnet: editAgentS1.carnet,
        },
      },
    );
  }

  async findDuplicate(dui: string): Promise<{ dui: boolean }> {
    let message = {
      dui: false,
      nit: false,
    };
    const datadui = await this.model.find({ dui: dui });
    if (datadui.length > 0) {
      message = { ...message, dui: true };
    }
    return message;
  }

  findAll() {
    return `This action returns all usersInformations`;
  }

  findOne(query: { [k in keyof UserInformationDocument]?: any }) {
    return this.model.findOne(query);
  }

  findById(id: any) {
    return this.model.findById(id);
  }

  update(
    query: { [k in keyof UserInformationDocument]?: any },
    params: {
      [k in keyof UserInformationDocument]?: any;
    },
  ): any {
    return this.model.updateOne<UserInformation>(query, {
      $set: params,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} usersInformation`;
  }
}
