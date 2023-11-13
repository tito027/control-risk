import { store } from "@/store"
import { getModule, Module, Mutation } from "vuex-module-decorators"
import Master from "@/store/modules/master"

@Module({ dynamic: true, namespaced: true, name: "table", store })
export class Tables extends Master {
  reload: boolean = false
  historyId: string = ""
  agencyId: string = ""

  // ***************************************** ACTIONS **************************************

  // ***************************************** GETS *****************************************
  get Reload(): boolean {
    return this.reload
  }
  get HistoryId(): string {
    return this.historyId
  }
  get AgencyId(): string {
    return this.agencyId
  }

  // ***************************************** MUTATIONS ************************************
  @Mutation
  setReload(data: boolean) {
    this.reload = data
  }
  @Mutation
  setHistoryId(data: string) {
    this.historyId = data
  }
  @Mutation
  setAgencyId(data: string) {
    this.agencyId = data
  }
}

export const TablesModule = getModule(Tables)
