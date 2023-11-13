import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import ApiGateway from "@/store/api"
import Master from "@/store/modules/master"
import { SalaryDocument as Salary } from "control-risk/salaries.schema"
import { Response } from "@/types/app"

@Module({ dynamic: true, namespaced: true, name: "config", store })
export class Config extends Master {
  _salaries: Salary[] = []

  /** Getters  **/
  get salaries() {
    return this._salaries
  }

  /** Mutations  **/
  @Mutation
  setSalaries(salaries: Salary[]) {
    this._salaries = salaries
  }

  /** Actions  **/
  @Action
  async updateManySalaries(payload: { [k: string]: Partial<Salary> }) {
    const response = await this.handleRequest({
      request: ApiGateway.put("/salaries/updateMany", payload),
    })
    return response
  }
  @Action
  async fetchSalariesConf() {
    const response = await this.handleRequest({
      request: ApiGateway.post<Response<Salary[]>>("/salaries/list", {
        pagination: {
          perPage: 0,
          currentPage: 1,
        },
        pag: 1,
        seeAll: false,
      }),
    })
    if (response.success) this.setSalaries(response.reply.data.data)
    return response
  }
}

export const ConfigModule = getModule(Config)
