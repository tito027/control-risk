import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import Master from "@/store/modules/master"
import { IAgency, IBusiness, IUser } from "control-risk"
import { UserInformation } from "control-risk/userInformation.schema"
import { User } from "control-risk/user.schema"
import ApiGateway from "@/store/api"
import { ElMessage } from "element-plus"
import { IUserInformation } from "@/types/control"

export type IAgentOverview = {
  _id: string
  username: string
  carnet: string
  connected: boolean
  working: boolean
  active: boolean
  image: boolean
  status: string
  createdAt: Date
  updateAt: Date
  userinformation: IUserInformation
  agencydata: IAgency
  businessesdata: IBusiness
}

@Module({ dynamic: true, namespaced: true, name: "Agents", store })
export class Agents extends Master {
  dataAgents: any[] = []
  totalRegisters: number = 0
  agentOverview: IAgentOverview | undefined = undefined
  agentOverviewLoading: boolean = true

  // ***************************************** ACTIONS *****************************************
  @Action
  async getAgents(filters: Object) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/agents/list", filters),
    })

    if (success) {
      this.setAgents(reply.data.data)
      this.setTotalRegisters(reply.data.totalRegistros)
    }
  }

  @Action
  async getOneAgent(filters: Object) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/agents/getAgent", filters),
    })
    if (success) {
      this.setAgentOverview(reply.data)
      return reply.data
    }

    return false
  }

  @Action
  async deleteAgent(filters: String) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put("/agents/delete", { userId: filters }),
    })
    if (success) {
      return reply.data
    }

    return false
  }

  @Action
  async pullAgent(filters: Object) {
    this.setIsOverviewLoading(true)

    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/agents/overview", filters),
    })
    if (success) {
      this.setAgentOverview(reply.data)
      this.setIsOverviewLoading(false)
    }
    return true
  }

  @Action
  async createAgent(data: any) {
    return await this.handleRequest({
      request: ApiGateway.post("/agents/create", data),
    })
    /*const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/agents/create", data),
    })*/
    //if (success) return reply
    // }
  }

  @Action
  async createAgentStep2(data: any) {
    return await this.handleRequest({
      request: ApiGateway.put("/agents/creates2", data),
    })
  }

  @Action
  async createAgentStep3(data: any) {
    // console.log("reply", reply)
    return await this.handleRequest({
      request: ApiGateway.put("/agents/creates3", data),
    })
  }

  @Action
  async createAgentBySteps(data: any) {
    // Este enpoint se le pasa por parámetro el step en el que se encuentra el usuario para llamar al endpoint correspondiente
    return await this.handleRequest({
      request: ApiGateway.put(`/agents/creates${data.step}`, data),
    })
  }

  @Action
  async updateAgentStepOne(data: any) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put("/agents/edits1", data),
    })
    if (success) return reply
  }

  // ***************************************** GETS *****************************************

  get Agents() {
    return this.dataAgents
  }

  get TotalRegisters() {
    return this.totalRegisters
  }
  get getAgentOverview() {
    return this.agentOverview
  }
  get getIsOverviewLoading() {
    return this.agentOverviewLoading
  }
  get getOverviewImages() {
    return this.getAgentOverview?.userinformation.picture
      ? [this.getAgentOverview?.userinformation.picture]
      : []
  }
  get getUserInformation() {
    const userInfo = this.getAgentOverview?.userinformation
    return userInfo
  }

  // ***************************************** MUTATIONS *****************************************

  @Mutation
  setUserInformation(payload: IUserInformation) {
    if (this.agentOverview) {
      ;(Object.keys(payload) as Array<keyof IUserInformation>).forEach(k => {
        // @ts-ignore
        this.agentOverview.userinformation[k as keyof IUserInformation] =
          payload[k]
      })
    }
  }
  @Mutation
  updateAgentOverview(payload: Partial<User>) {
    if (!this.agentOverview) return
    if (payload.userInformation)
      return Object.assign(
        this.agentOverview.userinformation,
        payload.userInformation
      )
    this.agentOverview = Object.assign(this.agentOverview, payload)
  }

  @Mutation
  setIsOverviewLoading(data: boolean) {
    this.agentOverviewLoading = data
  }
  @Mutation
  setAgents(data: any) {
    this.dataAgents = data
  }

  @Mutation
  setTotalRegisters(data: any) {
    this.totalRegisters = data
  }
  @Mutation
  setAgentOverview(data: any) {
    this.agentOverview = data
  }
  @Mutation
  setDocsInformation(data: IUserInformation["docs"]) {
    if (this.agentOverview?.userinformation.docs)
      this.agentOverview.userinformation.docs = data
  }

  // ***************************************** ACTIONS *****************************************

  @Action
  async setDoc(doc: IUserInformation["docs"][0]) {
    const { reply, success } = await this.handleRequest<IUserInformation>({
      request: ApiGateway.post<IUserInformation>(
        `/agents/docs/${this.getAgentOverview?.carnet}`,
        doc
      ),
    })
    if (!success)
      return ElMessage({
        type: "error",
        message: "No se pudo completar la actualización del documento",
      })
    this.setDocsInformation(reply.data.docs)
    return doc
  }

  @Action
  async updateUserInformation(data: Partial<IUserInformation>) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put<{ userInformation: IUserInformation }>(
        `agents/update/${this.getAgentOverview?.carnet}`,
        { userInformation: data }
      ),
    })
    if (!success)
      return ElMessage({
        type: "error",
        message: "No se ha podido completar la actualización del agente",
        showClose: true,
      })
    this.setUserInformation(reply.data.userInformation)
    return reply.data
  }

  @Action
  async upgradeOverview(data: Partial<User>) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.put<Partial<User>>(
        `/agents/update/${this.getAgentOverview?.carnet}`,
        data
      ),
    })
    if (success) this.updateAgentOverview(reply.data)
    return { reply, success }
  }
}

export const AgentsModule = getModule(Agents)
