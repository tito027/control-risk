import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import axios from "axios"
import { env } from "@/config"
import Master from "@/store/modules/master"
import { DiscountType } from "control-risk/schemas/discountType.schema"
import { GratificationType } from "control-risk/schemas/gratificationType.schema"

export type GratificationTypeModel = GratificationType & { _id: string }
export type DiscountTypeModel = DiscountType & { _id: string }
export type UserModal = { _id: string; username: string }
export type IPayrollModal = {
  payroll_id: string
  users: UserModal[]
  discounts: DiscountTypeModel[]
  gratifications: GratificationTypeModel[]
}

export type IPayrollModalResponse = {
  payroll_id: string
  users: UserModal[]
  selects: GratificationTypeModel[] | DiscountTypeModel[]
  type: string
}

const ApiGateway = axios.create({ baseURL: env.apiGateway })
const formatDate = (dateStr:string) => new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');

@Module({ dynamic: true, namespaced: true, name: "Payrolls", store })
export class Payrolls extends Master {
  dataPayrolls: any[] = []
  totalRegisters: number = 0
  currentPayroll: string = ""
  currentPayrollFrom: string = ""
  currentPayrollUntil: string = ""
  listUserModal: UserModal[] = []
  listDiscountModal: DiscountTypeModel[] = []
  listGratificationModal: GratificationTypeModel[] = []
  // ***************************************** ACTIONS *****************************************

  
  @Action
  async payrollActive() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/active"),
    })

    if (success) {
      this.setActivePayroll(reply.data._id)
      this.setActivePayrollFrom(reply.data.init_date)
      this.setActivePayrollUntil(reply.data.end_date)
    }
  }

  @Action
  async getPayrollDiscountUserExcell() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/modals/users/discount"),
    })
    if (success) {
      return { success, result: reply.data }
    }
  }

  @Action
  async getPayrolls(filters: Object) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/list", filters),
    })

    if (success) {
      this.setPayrolls(reply.data.data)
      this.setTotalRegisters(reply.data.totalRegistros)
    }
  }

  @Action
  async getHistoryDropdownData() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/history/dropdown"),
    })

    if (success) {
      return reply.data
    }
  }

  //getStoreData

  @Action
  async getAgenciesDropdownData(payload: {
    user: string
    isManagerRole: boolean
  }) {
    let route = "/agents/agencies/dropdown"
    const { user, isManagerRole } = payload
    route += !isManagerRole ? `/${user}` : "?isManagerRole=true"
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(route),
    })

    if (success) {
      return reply.data
    }
  }

  @Action
  async getStoreData() {
    let route = "/store/types"
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(route),
    })
    if (success) {
      return reply.data
    }
  }

  @Action
  async getAgencyExportExcelData(id: string) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(
        `/agents/agencies/exports/workshifts/excel/${id}`
      ),
    })
    if (success) {
      return { success, result: reply }
    }
  }

  @Action
  async getAgencyActualPriceExportExcelData(id: string) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(
        `/agents/agencies/exports/workshifts/excel/actual/price/${id}`
      ),
    })
    if (success) {
      return { success, result: reply }
    }
  }

  @Action
  async getPayrollExportTXTData(): Promise<any> {
    const result = await this.handleRequest({
      request: ApiGateway.get("/payrolls/exports/txt"),
    })
    const { reply, success } = result
    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async getPayrollExportCSVData(): Promise<any> {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/exports/csv"),
    })

    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async validateAndCreateHolidayGratification(payload: {
    user: string
    date: Date
    valuePerHour: number
    hoursWorked: number
  }) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/gratifications/holidays", payload),
    })

    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async getPayrollHistoyExportExcelData(id: string) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/history/table/" + id),
    })

    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async getPayrollExportBasePDFData(): Promise<any> {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/exports/pdfbase"),
    })
    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async getPayrollExportGratificationPDFData(): Promise<any> {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/exports/pdfgratifications"),
    })
    return {
      success: success,
      result: success ? reply.data : null,
    }
  }

  @Action
  async getGratificationDiscountData(
    type: string
  ): Promise<IPayrollModalResponse> {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/gratifications"),
    })

    if (success) {
      this.setCurrentPayroll(reply.data)
      this.setUsersCurrentPayroll(reply.data)
      this.setDiscountsPayroll(reply.data)
      this.setGratificationsPayroll(reply.data)
    }
    const resultData = {
      payroll_id: this.CurrentPayroll,
      users: this.UsersCurrentPayroll,
      selects:
        type === "DISCOUNT"
          ? this.DiscountsPayroll
          : this.GratificationsPayroll,
      type: type,
    }
    return resultData
  }

  @Action
  async getOnePayroll(filters: Object) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/getPayroll", filters),
    })
    if (success) {
      //this.setPayrollOverview(reply.data)
      return reply.data
    }

    return false
  }

  @Action
  async createPayroll(data: any) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/payrolls/create", data),
    })
    if (success) return reply
    // }
  }

  @Action
  async updateGratificationStatus(data: any) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put(`payrolls/gratifications/pending`, data),
    })
    if (success) {
      return reply.data
    }
    return false
  }

  @Action
  async updateDiscountStatus(data: any) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put(`payrolls/discounts/pending`, data),
    })
    if (success) {
      return reply.data
    }
    return false
  }

  @Action
  async getInventoryExcell(type: string) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(`inventory/${type}s/items`),
    })
    if (success) {
      return { result: reply, success }
    }
    return false
  }

  // ***************************************** GETS *****************************************

  get Payrolls() {
    return this.dataPayrolls
  }

  get TotalRegisters() {
    return this.totalRegisters
  }

  get CurrentPayroll() {
    return this.currentPayroll
  }

  get CurrentPayrollFrom() {
    return this.currentPayrollFrom
  }

  get CurrentPayrollUntil() {
    return this.currentPayrollUntil
  }

  get UsersCurrentPayroll() {
    return this.listUserModal
  }

  get DiscountsPayroll() {
    return this.listDiscountModal
  }

  get GratificationsPayroll() {
    return this.listGratificationModal
  }

  // ***************************************** MUTATIONS *****************************************

  @Mutation
  setPayrolls(data: any) {
    this.dataPayrolls = data
  }

  @Mutation
  setTotalRegisters(data: any) {
    this.totalRegisters = data
  }

  @Mutation
  setCurrentPayroll(data: IPayrollModal) {
    this.currentPayroll = data.payroll_id
  }

  
  @Mutation
  setUsersCurrentPayroll(data: IPayrollModal) {
    this.listUserModal = data.users
  }
  @Mutation
  setDiscountsPayroll(data: IPayrollModal) {
    this.listDiscountModal = data.discounts
  }
  @Mutation
  setGratificationsPayroll(data: IPayrollModal) {
    this.listGratificationModal = data.gratifications
  }
  @Mutation
  setActivePayroll(data: any) {
    this.currentPayroll = data
  }

  @Mutation
  setActivePayrollFrom(init_date: any) {
    this.currentPayrollFrom =  formatDate(init_date)
  }
  
  @Mutation
  setActivePayrollUntil(end_date: any) {
    this.currentPayrollUntil = formatDate(end_date)
  }
}

export const PayrollsModule = getModule(Payrolls)
