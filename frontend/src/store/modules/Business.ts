import { IRootState, store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import ApiGateway from "@/store/api"
import Master from "@/store/modules/master"
import { Module as Mod } from "vuex"
import { BusinessDocument as IBusiness } from "control-risk/business.schema"
import { ElMessage } from "element-plus"
import { IndexType } from "@/types/app"

export type Statistic = {
  id: string
  label: string
  total: number
  assignment: number
}

type IOverview = IBusiness & {
  contacts: {
    contactName: string
    contactEmail: string
    contactPhone: string
  }[]
}
export type IStatistic = IndexType<Statistic>
@Module({ dynamic: true, namespaced: true, name: "business", store })
export class Business extends Master {
  constructor(module: Mod<ThisType<Business>, IRootState>) {
    super(module)
    this._loading = false
  }
  _overview: IOverview | null = null
  _loading = false
  _statistics: IStatistic | null = null

  get isOverviewLoading() {
    return this._loading
  }

  get overview(): IOverview | null {
    return this._overview
  }

  get statistics(): IStatistic | null {
    return this._statistics
  }

  /** Mutations **/
  @Mutation
  setOverviewLoading(value: boolean) {
    this._loading = value
  }

  @Mutation
  setOverview(business: IOverview) {
    this._overview = business
  }

  @Mutation
  updateOverview(payload: Partial<IOverview>) {
    if (!this._overview) return
    this._overview = Object.assign(this._overview, payload)
  }

  @Mutation
  setStatistics(payload: IStatistic) {
    this._statistics = payload
  }

  @Mutation
  clearOverview() {
    this._overview = null
  }
  /** Actions */
  @Action
  async pullBusiness(filters: Partial<IOverview>) {
    this.setOverviewLoading(true)
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post<IOverview & { minimumSalary: number }>(
        "/business/overview",
        filters
      ),
      options: {
        hideAlert: true,
      },
    })
    this.setOverviewLoading(false)
    if (!success) {
      ElMessage({
        message: "No se ha podido obtener la información de esta empresa",
        type: "error",
      })
      return
    }
    const { minimumSalary, ...data } = reply.data
    data.baseSalary.securityAgent = data.baseSalary.securityAgent
      ? data.baseSalary.securityAgent
      : minimumSalary
    this.setOverview(data as IOverview)
  }

  @Action
  async upgradeOverview(data: Partial<IOverview>) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put<Partial<IOverview>>(
        `/business/update/${this._overview?._id}`,
        data
      ),
    })
    if (success) this.updateOverview(reply.data)
    return { reply, success }
  }

  @Action
  async getStatistics(businessId: string) {
    const roles = await this.handleRequest({
      request: ApiGateway.get<{
        data: { _id: string; label: string; code: number }[]
      }>("/roles/raw"),
    })
    if (!roles.success) return
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post<{
        assignedAgents: { code: number; count: number }[]
        totalAgents: { code: number; total: number }[]
      }>(`/business/statistics/${businessId}`),
    })

    if (success) {
      this.setStatistics(
        roles.reply.data.data.reduce((acc, r) => {
          acc[r._id] = {
            assignment:
              reply.data.assignedAgents.find(a => a.code === r.code)?.count ??
              0,
            total:
              reply.data.totalAgents.find(t => t.code === r.code)?.total ?? 0,
            id: r._id,
            label: r.label,
          }
          return acc
        }, {} as IStatistic)
      )
    }

    return { reply, success }
  }
}

export const BusinessModule = getModule(Business)
