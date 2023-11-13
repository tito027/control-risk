import { store } from "@/store"
import { ErrorItem } from "@/types/app"
import {
  Module,
  VuexModule,
  getModule,
  Mutation,
  Action,
} from "vuex-module-decorators"

@Module({ dynamic: true, namespaced: true, store, name: "alert" })
export class Alert extends VuexModule {
  alerts: ErrorItem[] = []

  get getError() {
    return this.alerts
  }

  @Mutation
  set(error: ErrorItem[]) {
    this.alerts = error
  }

  @Mutation
  add(error: ErrorItem) {
    this.alerts.push(error)
  }

  @Mutation
  shift() {
    this.alerts.shift()
  }
}

export const AlertModule = getModule(Alert)
