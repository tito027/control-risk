import { store } from "@/store"
import {
  Module,
  Mutation,
  VuexModule,
  getModule,
  Action,
} from "vuex-module-decorators"
import { User as IUser } from "control-risk/user.schema"
import Master from "./master"
import api from "../api"

export type CheckPayload = {
  user: IUser
  username: string
  picture: string
  inSite: boolean
  type: "checkIn" | "checkOut"
  inTime: boolean
}
export type SignPayload = {
  password: string
  physicalPosition: string
  reasonTime?: string
  reasonSite?: string
}

@Module({ dynamic: true, namespaced: true, name: "checkio", store })
export class CheckInOut extends Master {
  alerts: string[] = []
  user: IUser | null = null
  picture: string = ""
  type: string = "Check In"
  username: string = ""
  validation = {
    inSite: false,
    inTime: false,
  }
  coords: GeolocationCoordinates | null = null
  get reasons() {
    return this.validation
  }
  get checkin() {
    const { type, user, username, picture, alerts } = this
    return {
      type,
      user,
      username,
      picture,
      alerts,
    }
  }

  @Mutation
  setCoords(coord: GeolocationCoordinates) {
    this.coords = coord
  }

  @Mutation
  clearState() {
    this.user = null
    this.picture = ""
    this.username = ""
    this.coords = null
    this.error = undefined
    this.loading = false
    this.alerts = []
    this.type = ""
    this.validation = {
      inSite: false,
      inTime: false,
    }
  }

  @Mutation
  setCheckIn(payload: CheckPayload) {
    this.alerts = []
    if (!payload.inSite) this.alerts.push("Fuera del lugar asignado")
    if (!payload.inTime) this.alerts.push("Fuera del horario principal")
    this.validation.inSite = payload.inSite
    this.validation.inTime = payload.inTime
    this.user = payload.user
    this.type = payload.type === "checkIn" ? "Check In" : "Check Out"
    this.picture = payload.picture
    this.username = payload.username
  }

  @Action
  async sign(payload: SignPayload) {
    const { reply, success } = await this.handleRequest<any>({
      request: api.post(`/check-in-out`, {
        user: this.user?.carnet,
        latitude: this.coords?.latitude,
        longitude: this.coords?.longitude,
        ...payload,
      }),
    })
    return success
  }
}

export const CheckioModule = getModule(CheckInOut)
