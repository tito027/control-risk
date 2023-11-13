import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import axios from "axios"
import { env } from "@/config"
import Master from "@/store/modules/master"

const ApiGateway = axios.create({ baseURL: env.apiGateway })

@Module({ dynamic: true, namespaced: true, name: "PaymentMethod", store })
export class PaymentMethod extends Master {
  // ***************************************** ACTIONS *****************************************
  @Action
  async getPaymentMethods() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payments/methods"),
    })

    if (success) {
      return reply.data
    }
  }
  // ***************************************** GETS *****************************************
  /*
  get getOptionsData() {
    return this.optionsData
  }
  */
  // ***************************************** MUTATIONS *****************************************
  /*
  @Mutation
  setOptionsData(data: any[]) {
    this.optionsData = data
  }
  */
}

export const PaymentMethodModule = getModule(PaymentMethod)
