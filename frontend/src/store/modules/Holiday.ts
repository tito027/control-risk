import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import axios from "axios"
import { env } from "@/config"
import Master from "@/store/modules/master"

export type IAgentOverview = {
  optionData: []
}
const ApiGateway = axios.create({ baseURL: env.apiGateway })

@Module({ dynamic: true, namespaced: true, name: "Holidays", store })
export class Holidays extends Master {
  optionsData: any[] = []

  // ***************************************** ACTIONS *****************************************
  @Action
  async getExportTableData(
    data: any = {}
  ): Promise<{ success: boolean; data: any[] }> {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/holidays/exports"),
    })
    console.log(success, reply)
    if (success) {
      return { success, data: reply.data }
    }
    return { success, data: [] }
  }
  // ***************************************** GETS *****************************************

  // ***************************************** MUTATIONS *****************************************
}

export const HolidayModule = getModule(Holidays)
