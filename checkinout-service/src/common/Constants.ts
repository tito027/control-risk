export enum RabbitMQ {
  CheckInOutQueue = 'checkInOut',
  ReasonsQueue = 'reasons',
  Entries = 'entries',
}

export enum EntriesMessage {
  VALIDATE_LIST = 'ENTRIES_VALIDATE_LIST',
}

export enum CheckInOutMessage {
  CREATE = 'CREATE_CHECKINOUT',
  FIND_ALL = 'FIND_CHECKINOUT',
  FIND_ONE = 'FIND_ONE_CHECKINOUT',
  UPDATE = 'UPDATE_CHECKINOUT',
  DELETE = 'DELETE_CHECKINOUT',
  TRY_CHECK_IN_OUT = 'TRY_CHECK_IN_OUT_CHECKINOUT',
  CHECK_IN_OUT = 'CHECK_IN_OUT_CHECKINOUT',
}

export enum ReasonMessage {
  FIND_ALL = 'FIND_ALL_REASON',
}

export enum JWT {
  key = 'control-risk-secret',
}

export enum WorkDays {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}
