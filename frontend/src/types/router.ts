import { RouteLocationNormalized, RouteRecordRaw } from "vue-router"

export enum GuardRoles {
  GUEST = "guest",
  ANY = "any",
  ADMIN = "administrator",
  SYSTEM = "system",
  SUPERVISOR = "supervisor",
  COS = "COS",
  RRHH = "humanResources",
  MANAGER_RRHH = "managerHumanResources",
  ARCHIVE_RRHH = "archiveHumanResources",
  RECRUITER_RRHH = "recruiterHumanResources",
  INDUCTION_RRHH = "inductionHumanResources",
  ASSISTANT_RRHH = "assistantHumanResources",
  REP_LEGAL = "legalRepresentative",
  REP_FINANCIAL = "financialReprensentative",
  ACCOUNTING_ASSISTANT = "accountingAssistant",
  ACCOUNTING_COORDINATOR = "accountingCoordinator",
  BILLING_COORDINATOR = "billingCoordinator",
  GROUP_BOSS = "groupBoss",
  SECURITY_AGENT = "securityAgent",
  MOTORCYCLE_DRIVER_AGENT = "motorcycleDriverAgent",
  MOTORIZED_DRIVER_AGENT = "motorizedDriverAgent",
  PPI_DRIVER_AGENT = "ppiDriverAgent",
  PREVENTION_AGENT = "preventionAgent",
  ASSISTANT_SUPERVISOR = "assistantSupervisor",
  VSA_ANALIST = "VSAanalist",
  VSA_COORDINATOR = "VSACoordinator",
  OP_ASSISTANT = "operationAssistant",
  OP_COORDINATOR = "operationCoordinator",
  OP_MANAGER = "operationManager",
  LOGISTIC_ASSISTANT = "logisticsAssistant",
  LOGISTIC_COORDINATOR = "logisticsCoordinator",
  FLEET_CHIEF = "fleetChief",
  WORKSHOP_ASSISTANT = "workshopAssistant",
  GUNSMITH = "gunsmith",
  ADMINISTRATIVE_ASSISTANT = "administrativeAssistant",
  RECEPTION = "reception",
  COMPLIANCE_OFFICER = "complianceOfficer",
  IT_COORDINATOR = "ITCoordinator",
}

export const GuardGroupsRoles = {
  MANAGER_GROUP: [
    GuardRoles.OP_MANAGER,
    GuardRoles.MANAGER_RRHH,
    GuardRoles.REP_FINANCIAL,
    GuardRoles.REP_LEGAL,
    GuardRoles.COS,
  ] as ReadonlyArray<string>,
  RRHH_GROUP: [
    GuardRoles.RRHH,
    GuardRoles.RECRUITER_RRHH,
    GuardRoles.INDUCTION_RRHH,
    GuardRoles.ASSISTANT_RRHH,
    GuardRoles.MANAGER_RRHH,
    GuardRoles.ARCHIVE_RRHH,
  ] as ReadonlyArray<string>,
  ACCOUNTING_GROUP: [
    GuardRoles.REP_FINANCIAL,
    GuardRoles.ACCOUNTING_ASSISTANT,
    GuardRoles.ACCOUNTING_COORDINATOR,
    GuardRoles.BILLING_COORDINATOR,
  ] as ReadonlyArray<string>,
}

export type IRouteRecordRaw = Omit<RouteRecordRaw, "meta"> & {
  meta?: {
    guard?: GuardRoles[]
    assignedTicket?: boolean
    navbarType?: "light"
    noAutoNotify?: boolean
  }
}

export type IRouteLocationNormalized = Exclude<
  RouteLocationNormalized,
  "meta"
> & {
  meta?: IRouteRecordRaw["meta"]
}
