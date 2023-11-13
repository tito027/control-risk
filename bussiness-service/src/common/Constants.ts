export enum RabbitMQ {
  BusinessQueue = 'business',
  AgenciesQueue = 'agencies',
  PhysicalPositionQueue = 'physical',
  SchedulesQueue = 'schedules',
  UsersQueue = 'users',
  UserInfQueue = 'user-informations',
  PaymentMethodQueue = 'payment-method',
  PsychicQueue = 'psychic',
  RoleQueue = 'role',
  SalariesExchange = 'salaries',
}

export enum PaymentMethodMessage {
  GET_PAYMENT_METHOD_DATA = 'GET_PAYMENT_METHOD_DATA',
}

export enum BusinessMessage {
  CREATE = 'CREATE_BUSINESS',
  FIND_ALL = 'FIND_BUSINESS',
  LIST_ALL = 'LIST_BUSINESS',
  FIND_ONE = 'FIND_ONE_BUSINESS',
  UPDATE = 'UPDATE_BUSINESS',
  DELETE = 'DELETE_BUSINESS',
  FIND_AGENCIES = 'FIND_BUSINESS_AGENCIES',
  LIST_AGENCIES = 'LIST_BUSINESS_AGENCIES',
  GET_STATISTICS = 'GET_STATISTICS',
  FIND_CONFIG = 'FIND_BUSINESS_CONFIG',
  UPDATE_CONFIG = 'UPDATE_BUSINESS_CONFIG',
  OVERVIEW_BUSINESS = 'OVERVIEW_BUSINESS',
  GET_CONTACTS = 'GET_CONTACTS',
  GET_CONTACTS_TABLE = 'GET_CONTACTS_TABLE',
  CREATE_CONTACT = 'CREATE_CONTACT',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
}

export enum SalariesMessage {
  FIND_ALL = 'FIND_ALL',
  UPDATE_MANY = 'UPDATE_MANY',
}
export enum AgenciesMessage {
  OVERVIEW_AGENCY = 'OVERVIEW_AGENCY',
  CREATE = 'CREATE_AGENCIES',
  FIND_ALL = 'FIND_AGENCIES',
  ERROR = 'ERROR',
  FIND_ONE = 'FIND_ONE_AGENCIES',
  GET_STATISTICS = 'GET_STATISTICS',
  UPDATE = 'UPDATE_AGENCIES',
  DELETE = 'DELETE_AGENCIES',
  FIND_PHYSICALS = 'FIND_ONE_AGENCIES_PHYSICALS',
  FIND_RAW_ALL = 'FIND_RAW_ALL',
  FIND_CONFIG = 'FIND_AGENCY_CONFIG',
  UPDATE_CONFIG = 'UPDATE_AGENCY_CONFIG',
  UPDATE_COORDINATES = 'UPDATE_COORDINATES',
}
export enum Message {
  CREATE = 'CREATE_PSYCHIC',
  FIND_ALL = 'FIND_PSYCHIC',
  ERROR = 'ERROR',
  FIND_ONE = 'FIND_ONE_PSYCHIC',
  UPDATE = 'UPDATE_PSYCHIC',
  DELETE = 'DELETE_PSYCHIC',
}
export enum PhysicalPositionMessage {
  CREATE = 'CREATE_PHYSICAL',
  FIND_ALL = 'FIND_PHYSICALS',
  FIND_ONE = 'FIND_ONE_PHYSICALS',
  UPDATE = 'UPDATE_PHYSICAL',
  DELETE = 'DELETE_PHYSICAL',
  UPDATE_COORDINATES = 'UPDATE_COORDINATES',
  FIND_RAW = 'FIND_RAW',
}

export enum SchedulesMessage {
  CREATE = 'CREATE_SCHEDULES',
  FIND_ALL = 'FIND_SCHEDULES',
  FIND_ONE = 'FIND_ONE_SCHEDULES',
  UPDATE = 'UPDATE_SCHEDULES',
  DELETE = 'DELETE_SCHEDULES',
}

export enum UsersMessage {
  FIND_ALL = 'FIND_USERS',
  LIST_SUPERVISOR = 'LIST_SUPERVISOR',
}

export enum AgentMessage {
  FIND_ALL = 'FIND_USERS',
  GET_CARNET_GROUP = 'GET_CARNET_GROUP',
  GET_CARNET = 'GET_CARNET',
  UPDATE = 'UPDATE_AGENT',
  GET_ID = 'GET_ID',
  CREATE = 'CREATE_AGENT',
  CREAT2 = 'CREATE_AGENT_S2',
  CREAT3 = 'CREATE_AGENT_S3',
  CREAT4 = 'CREATE_AGENT_S4',
  CREAT5 = 'CREATE_AGENT_S5',
  CREAT6 = 'CREATE_AGENT_S6',
  CREAT7 = 'CREATE_AGENT_S7',
  CREAT8 = 'CREATE_AGENT_S8',
  EDIT = 'EDIT_AGENT',
  DEL = 'DELETE_AGENT',
  OVERVIEW_AGENT = 'OVERVIEW_AGENT',
  LIST_STATUS = 'LIST_STATUS',
  LIST_STATUS_VALUES = 'LIST_STATUS_VALUES',
  LIST_STATUS_REASON_VALUES = 'LIST_STATUS_REASON_VALUES',
  UPDATE_STATUS = 'UPDATE_STATUS',
  FIND_ONE = 'FIND_ONE_AGENT',
  UPDATE_ASSIGNMENT = 'UPDATE_USER_ASSIGNMENT',
  LIST_ASSIGNMENT = 'LIST_ASSIGNMENT',
}

export enum UserInformationsMessage {
  UPDATE = 'UPDATE_USER_INFORMATION',
  UPDATE_DOC = 'UPDATE_USER_INF_DOC',
}

export enum RoleMessage {
  LIST = 'LIST_ROLE',
  LIST_RAW = 'LIST_RAW',
}

export enum ZonesEnum {
  OCCIDENTAL = 'OCCIDENTAL',
  ORIENTAL = 'ORIENTAL',
  CENTRAL = 'CENTRAL',
}
export enum PsychicMessage {
  CREATE = 'CREATE_PSYCHIC',
  REGISTER = 'REGISTER_PSYCHIC',
  FIND_ALL = 'FIND_PSYCHIC',
  FIND_ONE = 'FIND_ONE_PSYCHIC',
  UPDATE = 'UPDATE_PSYCHIC',
  DELETE = 'DELETE_PSYCHIC',
  FIND_LIST = 'FIND_LIST_PSYCHIC',
  GETANSWERLISTBYUSER = 'GET_ANSWER_LIST_BY_USER',
  GETANSWERBYID = 'GET_ANSWER_BY_ID',
}
export const AgentStatusValues = {
  0: 'Pre-selección',
  1: 'Pruebas y Entrevistas',
  2: 'Rechazado',
  3: 'Contratación e inducción',
  4: 'Activo',
  5: 'Baja',
  6: 'Inaceptables',
  7: 'Turno Extra',
  8: 'Reingreso',
};

export const RoleValues = {
  0: 'Administrador',
  1: 'Sistema',
  2: 'Supervisor',
  3: 'Gerente de operaciones',
  4: 'COS',
  5: 'Recursos humanos',
  6: 'Representante legal',
  7: 'Representante financiero',
  8: 'Jefe de grupo',
  9: 'Agente de seguridad',
  10: 'Protección a personas importantes',
  11: 'Agente motorizado',
  12: 'Motorista',
  13: 'Agente de prevensión',
  14: 'Asistente de supervisor',
};
