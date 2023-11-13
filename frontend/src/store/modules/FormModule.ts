import { store } from "@/store"
import {
  Module,
  VuexModule,
  getModule,
  Mutation,
} from "vuex-module-decorators"

export enum ModalType {
  create = "create",
  edit = "edit",
}

@Module({ dynamic: true, namespaced: true, store, name: "FormModal" })
export class FormModal extends VuexModule {
  id: string = ''
  type: ModalType = ModalType.create
  endpoint: string = ""
  data: any
  updateData = 0

  get getId() {
    return this.id
  }

  get getType() {
    return this.type
  }

  get getEndpoint() {
    return this.endpoint
  }

  get getData() {
    return this.data
  }

  get getUpdateData() {
    return this.updateData
  }

  @Mutation
  setId(id: string) {
    this.id = id
  }

  @Mutation
  setType(id: ModalType) {
    this.type = id
  }

  @Mutation
  setEndpoint(id: string) {
    this.endpoint = id
  }

  @Mutation
  setData(data: any) {
    this.data = data
  }

  @Mutation
  setUpdateData() {
    this.updateData = this.updateData + 1
  }
}

export const FormModule = getModule(FormModal)
