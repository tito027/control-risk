import { store } from "@/store"
import {
  Module,
  VuexModule,
  getModule,
  Mutation,
} from "vuex-module-decorators"

@Module({ dynamic: true, namespaced: true, store, name: "confirmModal" })
export class ConfirmModal extends VuexModule {
  title: string = ''
  text: string = ''
  endpoint: string = ''
  icon = 'fa-trash'
  iconSize = 25
  iconColor = '#1F2A5A'
  buttonText = 'Confirmar'
  buttonColor = 'primary'
  loading = false

  get getTitle() {
    return this.title
  }

  get getText() {
    return this.text
  }

  get getEndpoint() {
    return this.endpoint
  }

  get getButtonText() {
    return this.buttonText
  }

  get getButtonColor() {
    return this.buttonColor
  }

  get getIcon() {
    return {
      icon: this.icon,
      iconSize: this.iconSize,
      iconColor: this.iconColor,
    }
  }

  get getLoading() {
    return this.loading
  }

  @Mutation
  setTitle(title: string) {
    this.title = title
  }

  @Mutation
  setText(text: string) {
    this.text = text
  }

  @Mutation
  setEndpoint(id: string) {
    this.endpoint = id
  }

  @Mutation
  setButtonText(text: string) {
    this.buttonText = text
  }

  @Mutation
  setButtonColor(color: string) {
    this.buttonColor = color
  }

  @Mutation
  setIcon(icon : {icon?: string, color?: string, size?: number} ) {
    this.icon = icon.icon ? icon.icon : this.icon
    this.iconColor = icon.color ? icon.color : this.iconColor
    this.iconSize = icon.size ? icon.size : this.iconSize
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading
  }
}

export const ConfirmModalModule = getModule(ConfirmModal)
