import { DefaultDTO } from './default.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgentsDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  readonly carnet: string;
  @ApiProperty()
  @IsString()
  readonly pag: string;
}

export class OverviewDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  readonly carnet: string;
}
export class CreateAgentS1DTO {
  name: string;
  lastname: string;
  address: string;
  municipality: string;
  department: string;
  birthdate: string;
  birthplace: string;
  gender: string;
  allergic: string;
  homePhone: string;
  cellPhone: string;
  profession: string;
  nit: string;
  dui: string;
  expeditionDate: string;
  expeditionPlace: string;
  isss: string;
  afpNup: string;
  ipsfa: string;
  maritalStatus: string;
  driverLicense: string;
  class: string;
  weaponLicense: string;
  expirationWeaponLicense: string;
  bloodType: string;
  ansp: boolean;
  anspDate: string;
  anspNo: number;
  carnet: string;
  nextStep: number;
  userId: string;
}

export class CreateAgentS2DTO {
  userInfoId: string;
  height: number;
  weight: number;
  face: string;
  lips: string;
  eyesColor: string;
  nose: string;
  hairTypeColor: string;
  skinColor: string;
  specialSings: string;
  tattos: string;
  job: string;
  salary: number;
  nextStep: number;
  isEdit: boolean;
}

export class CreateAgentS3DTO {
  userInfoId: string;
  master: { institution: string; place: string; date: Date; title: string };
  university: { institution: string; place: string; date: Date; title: string };
  certified: { institution: string; place: string; date: Date; title: string };
  highSchool: { institution: string; place: string; date: Date; title: string };
  thirdCycle: { institution: string; place: string; date: Date; title: string };
  secondCycle: {
    institution: string;
    place: string;
    date: Date;
    title: string;
  };
  firstCycle: { institution: string; place: string; date: Date; title: string };
  previousJob: {
    institution: string;
    place: string;
    date: Date;
    title: string;
  };
  militaryService: {
    institution: string;
    place: string;
    name: string;
    level: string;
  };
  currentlyStudying: {
    isStudying: boolean;
    place: string;
    name: string;
    title: string;
  };
  nextStep: number;
  isEdit: boolean;
}

export class CreateAgentS4DTO {
  userInfoId: string;
  computerKnowledge: {
    word: boolean;
    excel: boolean;
    powerpoint: boolean;
    access: boolean;
    other: string;
  };
  englishKnowledge: {
    englisRead: boolean;
    englishWrite: boolean;
    englishSpeak: boolean;
    otherLanguages: string;
  };
  otherSkills: {
    computer: boolean;
    proyector: boolean;
    vehicle: boolean;
    bicycle: boolean;
    fax: boolean;
    extinguisher: boolean;
    truck: boolean;
    crane: boolean;
    telephonePlant: boolean;
    electronicPlant: boolean;
    motocycle: boolean;
    firearms: boolean;
    photocopier: boolean;
    cctv: boolean;
    trailer: boolean;
    electricConnections: boolean;
    alarms: boolean;
    forklift: boolean;
    others: string;
  };
  nextStep: number;
  isEdit: boolean;
}
export class CreateAgentS5DTO {
  userInfoId: string;
  workHistory: {
    companyName: string;
    address: string;
    activity: string;
    telephone: {
      cellPhone: string;
    }[];
    immediateBoss: string;
    positionCompany: string;
    exitReason: string;
    entryDate: Date;
    exitDate: Date;
  }[];
  nextStep: number;
  isEdit: boolean;
}
export class CreateAgentS6DTO {
  userInfoId: string;
  familyReferences: {
    name: string;
    kinship: string;
    cellPhone: string;
  }[];
  personalReferences: {
    name: string;
    kinship: string;
    cellPhone: string;
  }[];
  nextStep: number;
  isEdit: boolean;
}

export class CreateAgentS7DTO {
  userInfoId: string;
  familyRelationship: {
    relationship: string;
    completeName: string;
    age: number;
    job: string;
    cellPhone: string;
  }[];
  nextStep: number;
  isEdit: boolean;
}

export class CreateAgentS8DTO {
  userId: string;
  userInfoId: string;
  cohabitant: {
    name: string;
    age: string;
    birthdate: string;
    dui: string;
    job: string;
    workplace: string;
    address: string;
    position: string;
    salary: number;
    officePhone: string;
    cellPhone: string;
  };
  nextStep: number;
  isEdit: boolean;
}

export class UserIdDTO {
  userId: string;
}
