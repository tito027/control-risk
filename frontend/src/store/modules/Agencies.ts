import { IRootState, store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import ApiGateway from "@/store/api"
import Master from "@/store/modules/master"
import { Module as Mod } from "vuex"
import { AgencyDocument as IAgency } from "control-risk/agency.schema"
import { ElMessage } from "element-plus"
import { IStatistic } from "./Business"

@Module({ dynamic: true, namespaced: true, name: "agency", store })
export class Agency extends Master {
  constructor(module: Mod<ThisType<Agency>, IRootState>) {
    super(module)
    this._loading = false
  }
  _overview: IAgency | null = null

  _loading = false

  _statistics: IStatistic | null = null

  get isOverviewLoading() {
    return this._loading
  }

  get overview(): IAgency | null {
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
  setOverview(business: IAgency) {
    this._overview = business
  }

  @Mutation
  clearOverview() {
    this._overview = null
  }

  @Mutation
  updateOverview(payload: Partial<IAgency>) {
    if (!this._overview) return
    this._overview = Object.assign(this._overview, payload)
  }

  @Mutation
  setStatistics(payload: IStatistic) {
    this._statistics = payload
  }

  /** Actions */
  @Action
  async pullBusiness(filters: Partial<IAgency>) {
    this.setOverviewLoading(true)
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post<IAgency>("/agencies/overview", filters),
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
    this.setOverview(reply.data)
  }

  @Action
  async upgradeOverview(data: Partial<IAgency>) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put<Partial<IAgency>>(
        `/agencies/update/${this._overview?._id}`,
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
      }>(`/agencies/statistics/${businessId}`),
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

export const AgencyModule = getModule(Agency)
