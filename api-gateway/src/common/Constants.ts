export enum RabbitMQ {
  BusinessQueue = 'business',
  AgenciesQueue = 'agencies',
  PhysicalPositionQueue = 'physical',
  SchedulesQueue = 'schedules',
  CheckInOutQueue = 'checkInOut',
  ReasonsQueue = 'reasons',
  UsersQueue = 'users',
  PayrollQueue = 'payroll',
  PsychicQueue = 'psychic',
  PaymentMethodQueue = 'payment-method',
  AgentQueue = 'agent',
  RoleQueue = 'role',
}

export enum Exchanges {
  Administration = 'administration',
  Agencies = 'agencies',
  Business = 'business',
  Physicalposition = 'physical',
  Schedules = 'schedules',
  CheckInOut = 'checkInOut',
  Reasons = 'reasons',
  Users = 'users',
  UserInformation = 'user-informations',
  Payroll = 'payroll',
  Entries = 'entries',
  Psychic = 'psychic',
  PaymentMethod = 'payment-method',
  Holiday = 'holiday',
  Agents = 'agent',
  Role = 'role',
  Salaries = 'salaries',
}

export enum BusinessMessage {
  CREATE = 'CREATE_BUSINESS',
  GET_STATISTICS = 'GET_STATISTICS',
  FIND_ALL = 'FIND_BUSINESS',
  LIST_ALL = 'LIST_BUSINESS',
  FIND_ONE = 'FIND_ONE_BUSINESS',
  UPDATE = 'UPDATE_BUSINESS',
  DELETE = 'DELETE_BUSINESS',
  FIND_AGENCIES = 'FIND_BUSINESS_AGENCIES',
  LIST_AGENCIES = 'LIST_BUSINESS_AGENCIES',
  FIND_CONFIG = 'FIND_BUSINESS_CONFIG',
  UPDATE_CONFIG = 'UPDATE_BUSINESS_CONFIG',
  OVERVIEW_BUSINESS = 'OVERVIEW_BUSINESS',
  GET_CONTACTS = 'GET_CONTACTS',
  GET_CONTACTS_TABLE = 'GET_CONTACTS_TABLE',
  CREATE_CONTACT = 'CREATE_CONTACT',
  UPDATE_CONTACT = 'UPDATE_CONTACT',
}

export enum EntriesMessage {
  VALIDATE_LIST = 'ENTRIES_VALIDATE_LIST',
}

export enum ItemMessage {
  GET_ITEMS_DATA = 'GET_ITEMS_DATA',
  UPDATE_ITEM_DATA = 'UPDATE_ITEM_DATA',
  UPDATE_MASSIVE_ITEM_DATA = 'UPDATE_MASSIVE_ITEM_DATA',
  UNASIGNED_ITEM_USER = 'UNASIGNED_ITEM_USER',
  GET_ITEMS_INVENTORY_DATA = 'GET_ITEMS_INVENTORY_DATA',
}

export enum SalariesMessage {
  FIND_ALL = 'FIND_ALL',
  UPDATE_MANY = 'UPDATE_MANY',
}
export enum AgenciesMessage {
  CREATE = 'CREATE_AGENCIES',
  GET_STATISTICS = 'GET_STATISTICS',
  FIND_ALL = 'FIND_AGENCIES',
  OVERVIEW_AGENCY = 'OVERVIEW_AGENCY',
  FIND_ONE = 'FIND_ONE_AGENCIES',
  UPDATE = 'UPDATE_AGENCIES',
  DELETE = 'DELETE_AGENCIES',
  FIND_PHYSICALS = 'FIND_ONE_AGENCIES_PHYSICALS',
  FIND_RAW_ALL = 'FIND_RAW_ALL',
  FIND_CONFIG = 'FIND_AGENCY_CONFIG',
  UPDATE_CONFIG = 'UPDATE_AGENCY_CONFIG',
  UPDATE_COORDINATES = 'UPDATE_COORDINATES',
}
export enum RequestMessage {
  GET_HOLIDAYS_DATA = 'GET_HOLIDAYS_DATA',
  GET_HOLIDAY_DATA = 'GET_HOLIDAY_DATA',
  GET_HOLIDAYS_EXPORT_DATA = 'GET_HOLIDAYS_EXPORT_DATA',
  UPDATE_HOLIDAY_DATA = 'UPDATE_HOLIDAY_DATA',
  DELETE_HOLIDAY_DATA = 'DELETE_HOLIDAY_DATA',
  CREATE_HOLIDAY_DATA = 'CREATE_HOLIDAY_DATA',
}
export enum ComplaintsMessage {
  GET_COMPLAINT_DATA = 'GET_COMPLAINT_DATA',
  GET_COMPLAINTS_DATA = 'GET_COMPLAINTS_DATA',
  GET_COMPLAINTS_STATUS_DROPDOWN_DATA = 'GET_COMPLAINTS_STATUS_DROPDOWN_DATA',
  CREATE_COMPLAINTS_DATA = 'CREATE_COMPLAINTS_DATA',
  UPDATE_COMPLAINTS_DATA = 'UPDATE_COMPLAINTS_DATA',
  DELETE_COMPLAINTS_DATA = 'DELETE_COMPLAINTS_DATA',
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
export enum PaymentMethodMessage {
  GET_PAYMENT_METHOD_DATA = 'GET_PAYMENT_METHOD_DATA',
}

export enum NewsTypeMessage {
  GET_NEWS_TYPE_DATA = 'GET_NEWS_TYPE_DATA',
}
export enum ReportsTypeMessage {
  GET_REPORTS_TYPE_DATA = 'GET_REPORTS_TYPE_DATA',
}

export enum InventoryMessage {
  UPLOAD_INVENTORY_DATA = 'UPLOAD_INVENTORY_DATA',
  GET_INVENTORY_DATA = 'GET_INVENTORY_DATA',
  GET_NO_AGENCY_DATA = 'GET_NO_AGENCY_DATA',
  UPDATE_INVENTORY_DATA = 'UPDATE_INVENTORY_DATA',
  CREATE_INVENTORY_DATA = 'CREATE_INVENTORY_DATA',
}

export enum ReportsMessage {
  GET_REPORTS_DATA = 'GET_REPORTS_DATA',
  CREATE_REPORTS_DATA = 'CREATE_REPORTS_DATA',
  UPDATE_REPORTS_DATA = 'UPDATE_REPORTS_DATA',
  DELETE_REPORTS_DATA = 'DELETE_REPORTS_DATA',
}

export enum ItemTypeMessage {
  GET_ITEMS_TYPE_DATA = 'GET_ITEMS_TYPE_DATA',
}

export enum NewsMessage {
  GET_NEWS_DATA = 'GET_NEWS_DATA',
  CREATE_NEWS_DATA = 'CREATE_NEWS_DATA',
  UPDATE_NEWS_DATA = 'UPDATE_NEWS_DATA',
  DELETE_NEWS_DATA = 'DELETE_NEWS_DATA',
}
export enum PayrollMessage {
  GET_DEPARTMENT_DATA = 'GET_DEPARTMENT_DATA',
  GET_MUNICPALITY_DATA = 'GET_MUNICPALITY_DATA',
  FIND_ALL = 'FIND_PAYROLLS',
  FIND_ACTIVE_PAYROLL = 'FIND_ACTIVE_PAYROLL',
  CLOSE_ACTIVE_PAYROLL = 'CLOSE_ACTIVE_PAYROLL',
  GET_PAYROLL_HISTORY_DATA = 'GET_PAYROLL_HISTORY_DATA',
  FIND_BY_ID = 'FIND_BY_ID',
  //UPDATE = 'UPDATE_PAYROLL',
  GET_PAYROLL_DATA = 'GET_PAYROLL_DATA',
  GET_PAYROLL_HISTORY_WITH_PAYROLL_DATA = 'GET_PAYROLL_HISTORY_WITH_PAYROLL_DATA',
  GET_PAYROLL_USER_DATA = 'GET_PAYROLL_USER_DATA',
  GET_PAYROLL_GRATIFICATION_DATA = 'GET_PAYROLL_GRATIFICATION_DATA',
  GET_PAYROLL_GRATIFICATION_TYPE_DATA = 'GET_PAYROLL_GRATIFICATION_TYPE_DATA',
  GET_PAYROLL_GRATIFICATION_TYPE_TABLE = 'GET_PAYROLL_GRATIFICATION_TYPE_TABLE',
  GET_PAYROLL_DISCOUNT_DATA = 'GET_PAYROLL_DISCOUNT_DATA',
  GET_PAYROLL_DISCOUNT_TYPE_DATA = 'GET_PAYROLL_DISCOUNT_TYPE_DATA',
  GET_PAYROLL_DISCOUNT_TYPE_TABLE = 'GET_PAYROLL_DISCOUNT_TYPE_TABLE',
  GET_PAYROLL_DISCOUNT_PENDING_TABLE_ADMIN = 'GET_PAYROLL_DISCOUNT_PENDING_TABLE_ADMIN',
  GET_PAYROLL_DISCOUNT_PENDING_TABLE_SUPERVISOR = 'GET_PAYROLL_DISCOUNT_PENDING_TABLE_SUPERVISOR',
  GET_PAYROLL_DISCOUNT_PENDING_TABLE = 'GET_PAYROLL_DISCOUNT_PENDING_TABLE',
  GET_SCHEDULED_DISCOUNT_PENDING_TABLE = 'GET_SCHEDULED_DISCOUNT_PENDING_TABLE',
  CREATE_PAYROLL = 'CREATE_PAYROLL',
  CREATE_PAYROLL_GRATIFICATION = 'CREATE_PAYROLL_GRATIFICATION',
  CREATE_PAYROLL_HOLIDAY_GRATIFICATION = 'CREATE_PAYROLL_HOLIDAY_GRATIFICATION',
  CREATE_PAYROLL_GRATIFICATION_TYPE = 'CREATE_PAYROLL_GRATIFICATION_TYPE',
  CREATE_PAYROLL_DISCOUNT = 'CREATE_PAYROLL_DISCOUNT',
  CREATE_PAYROLL_DISCOUNT_TYPE = 'CREATE_PAYROLL_DISCOUNT_TYPE',
  CREATE_PAYROLL_SCHEDULED_DISCOUNT = 'CREATE_PAYROLL_SCHEDULED_DISCOUNT',
  CREATE_PAYROLL_SCHEDULED_GRATIFICATION = 'CREATE_PAYROLL_SCHEDULED_GRATIFICATION',
  ASSIGN_PAYROLL_GRATIFICATION = 'ASSIGN_PAYROLL_GRATIFICATION',
  ASSIGN_PAYROLL_DISCOUNT = 'ASSIGN_PAYROLL_DISCOUNT',
  ASSIGN_PAYROLL_MASSIVE_DISCOUNT = 'ASSIGN_PAYROLL_MASSIVE_DISCOUNT',
  ASSIGN_PAYROLL_MASSIVE_GRATIFICATION = 'ASSIGN_PAYROLL_MASSIVE_GRATIFICATION',
  GET_PAYROLL_EXPORT_DATA = 'GET_PAYROLL_EXPORT_DATA',
  GET_PAYROLL_SCHEDULED_DISCOUNT_TABLE = 'GET_PAYROLL_SCHEDULED_DISCOUNT_TABLE',
  GET_PAYROLL_SCHEDULED_GRATIFICATION_TABLE = 'GET_PAYROLL_SCHEDULED_GRATIFICATION_TABLE',
  GET_PAYROLL_GRATIFICATIONS_PENDING = 'GET_PAYROLL_GRATIFICATIONS_PENDING',
  GET_PAYROLL_GRATIFICATIONS_PENDING_ADMIN = 'GET_PAYROLL_GRATIFICATIONS_PENDING_ADMIN',
  GET_PAYROLL_GRATIFICATIONS_PENDING_SUPERVISOR = 'GET_PAYROLL_GRATIFICATIONS_PENDING_SUPERVISOR',
  PUT_PAYROLL_DISCOUNT_PENDING = 'PUT_PAYROLL_DISCOUNT_PENDING',
  PUT_PAYROLL_GRATIFICATION_PENDING = 'PUT_PAYROLL_GRATIFICATION_PENDING',
  UPDATE_PAYROLL_DISCOUNT_TYPE = 'UPDATE_PAYROLL_DISCOUNT_TYPE',
  UPDATE_PAYROLL_GRATIFICATION_TYPE = 'UPDATE_PAYROLL_GRATIFICATION_TYPE',
  UPDATE_PAYROLL_SCHEDULED_DISCOUNT_TYPE = 'UPDATE_PAYROLL_SCHEDULED_DISCOUNT_TYPE',
  UPDATE_PAYROLL_SCHEDULED_GRATIFICATION_TYPE = 'UPDATE_PAYROLL_SCHEDULED_GRATIFICATION_TYPE',
  GET_PAYROLL_BUSINESS_AGENCY_USER_DATA = 'GET_PAYROLL_BUSINESS_AGENCY_USER_DATA',
  GET_PAYROLL_BUSINESS_DATA = 'GET_PAYROLL_BUSINESS_DATA',
  GET_PAYROLL_ROLE_DATA = 'GET_PAYROLL_ROLE_DATA',
  GET_PAYROLL_ZONE_DATA = 'GET_PAYROLL_ZONE_DATA',
  GET_PAYROLL_ROLE_USER_DATA = 'GET_PAYROLL_ROLE_USER_DATA',
  GET_PAYROLL_ZONE_USER_DATA = 'GET_PAYROLL_ZONE_USER_DATA',
  VALIDATE_HOURS = 'VALIDATE_HOURS',
  GET_AGENCY_LIST = 'GET_AGENCY_LIST',
  CREATE_PAYROLL_MASSIVE_DISCOUNT = 'CREATE_PAYROLL_MASSIVE_DISCOUNT',
}

export enum PhysicalPositionMessage {
  CREATE = 'CREATE_PHYSICAL',
  FIND_ALL = 'FIND_PHYSICALS',
  FIND_ONE = 'FIND_ONE_PHYSICALS',
  UPDATE = 'UPDATE_PHYSICAL',
  DELETE = 'DELETE_PHYSICAL',
  FIND_RAW = 'FIND_RAW',
  UPDATE_COORDINATES = 'UPDATE_COORDINATES',
}

export enum SchedulesMessage {
  CREATE = 'CREATE_SCHEDULES',
  FIND_ALL = 'FIND_SCHEDULES',
  FIND_ONE = 'FIND_ONE_SCHEDULES',
  UPDATE = 'UPDATE_SCHEDULES',
  DELETE = 'DELETE_SCHEDULES',
}

export enum CheckInOutMessage {
  CREATE = 'CREATE_CHECKINOUT',
  FIND_ALL = 'FIND_CHECKINOUT',
  FIND_ONE = 'FIND_ONE_CHECKINOUT',
  UPDATE = 'UPDATE_CHECKINOUT',
  DELETE = 'DELETE_CHECKINOUT',
  TRY_CHECK_IN_OUT = 'TRY_CHECK_IN_OUT_CHECKINOUT',
  CHECK_IN_OUT = 'CHECK_IN_OUT_CHECKINOUT',
  VALIDATE_LIST = 'CHECK_IN_OUT_VALIDATE_LIST',
}

export enum UsersMessage {
  FIND_ALL = 'FIND_USERS',
  GET_CARNET = 'GET_CARNET',
  LIST_SUPERVISOR = 'LIST_SUPERVISOR',
}
export enum AgentMessage {
  FIND_ALL = 'FIND_USERS',
  GET_CARNET = 'GET_CARNET',
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
  UPDATE = 'UPDATE_AGENT',
  GET_AGENTS_DATA = 'GET_AGENTS_DATA',
  GET_AGENT_DATA = 'GET_AGENT_DATA',
  UPDATE_AGENT_DATA = 'UPDATE_AGENT_DATA',
  DELETE_AGENT_DATA = 'DELETE_AGENT_DATA',
  CREATE_AGENT_DATA = 'CREATE_AGENT_DATA',
  LIST_STATUS = 'LIST_STATUS',
  LIST_STATUS_VALUES = 'LIST_STATUS_VALUES',
  LIST_STATUS_REASON_VALUES = 'LIST_STATUS_REASON_VALUES',
  UPDATE_STATUS = 'UPDATE_STATUS',
  GET_WORKSHIFT_WORKDAY_DATA = 'GET_WORKSHIFT_WORKDAY_DATA',
  CREATE_WORKSHIFTS = 'CREATE_WORKSHIFTS',
  UPDATE_WORKSHIFTS = 'UPDATE_WORKSHIFTS',
  FIND_ONE = 'FIND_ONE_AGENT',
  UPDATE_ASSIGNMENT = 'UPDATE_USER_ASSIGNMENT',
  LIST_ASSIGNMENT = 'LIST_ASSIGNMENT',
  GET_AGENTS_AGENCIES_DROPDOWN_DATA = 'GET_AGENTS_AGENCIES_DROPDOWN_DATA',
  GET_AGENTS_AGENCIES_EXPORT_EXCEL_DATA = 'GET_AGENTS_AGENCIES_EXPORT_EXCEL_DATA',
  GET_AGENTS_AGENCIES_EXPORT_ACTUAL_PRICE_EXCEL_DATA = 'GET_AGENTS_AGENCIES_EXPORT_ACTUAL_PRICE_EXCEL_DATA',
}

export enum UserInformationsMessage {
  UPDATE = 'UPDATE_USER_INFORMATION',
  UPDATE_DOC = 'UPDATE_USER_INF_DOC',
}

export enum ReasonMessage {
  FIND_ALL = 'FIND_ALL_REASON',
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

export enum JWT {
  secret = 'controlRisk@2022.sv',
  expiresIn = '60m',
  appUrl = 'https://controlrisk.com.sv',
}

export enum ActiveRoles {
  admin = 'administrator',
  supervisor = 'supervisor',
  agent = 'securityAgent',
}
