import { IRootState, store } from "@/store"
import {
  Module,
  Mutation,
  getModule,
  Action,
  VuexModule,
} from "vuex-module-decorators"
import { IUser } from "control-risk"
import Master from "./master"
import { GuardRoles } from "@/types/router"
import jwt_decode, { JwtPayload } from "jwt-decode"
import { Session } from "@/types/user"
import { Module as Mod } from "vuex"
import { ElMessage } from "element-plus"
import router from "@/router"
import ApiGateway from "../api"

export type ILoginForm = {
  carnet: string
  password: string
}

export type IAuthModule = {
  user: IUser | null
  verifiedToken: boolean
  _token: string | null
  loading: boolean
}

@Module({ dynamic: true, namespaced: true, store, name: "auth" })
export class Auth extends Master implements IAuthModule {
  constructor(module: Mod<ThisType<IAuthModule>, IRootState>) {
    super(module)
    const token = localStorage.getItem("ACCESS_TOKEN")
    this.setToken(token ?? undefined)
  }
  user: IUser | null = null
  verifiedToken: boolean = false
  _token: string | null = null
  loggingIn: boolean = false
  timer: NodeJS.Timeout | undefined = undefined

  get role() {
    return this.user?.role.name ? this.user?.role.name : GuardRoles.GUEST
  }

  get token() {
    return this._token
  }

  get id() {
    //@ts-ignore
    return this.user?._id
  }

  get isAuthenticated() {
    if (this.token) {
      const decodeToken = jwt_decode<JwtPayload>(this.token)
      const ttl: number =
        new Date((decodeToken?.exp ?? 0) * 1000).valueOf() - Date.now()
      if (ttl < 0) return Session.INVALID
      if (!this.verifiedToken) return Session.UNVERIFIED
      return Session.VERIFIED
    }
    return Session.UNVERIFIED
  }

  get LoggingIn() {
    return this.loggingIn
  }

  @Mutation
  setLoggingIn(loggingIn: boolean) {
    this.loggingIn = loggingIn
  }

  @Mutation
  setToken(token: string | undefined) {
    if (token) {
      ApiGateway.defaults.headers.common["Authorization"] = `Bearer ${token}`
      localStorage.setItem("ACCESS_TOKEN", token)
      this._token = token
    } else {
      delete ApiGateway.defaults.headers.common["Authorization"]
      localStorage.removeItem("ACCESS_TOKEN")
      this._token = null
    }
  }

  @Mutation
  setUser(user: IUser | null) {
    this.user = user
  }

  @Mutation
  setVerifiedToken(verified: boolean) {
    this.verifiedToken = verified
  }

  @Mutation
  setTimer(timer: NodeJS.Timeout) {
    this.timer = timer
  }

  @Action
  async validateToken() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/auth/validatedToken"),
      options: {
        hideAlert: true,
      },
    })
    if (success) {
      this.setUser(reply.data.user ?? null)
      this.setVerifiedToken(reply.data.validToken ?? false)
      this.initTimeout()
    } else {
      this.setUser(null)
      this.setVerifiedToken(false)
    }
  }

  @Action
  async refreshToken() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/auth/refresh"),
      options: {
        hideAlert: true,
      },
    })
    if (success) {
      this.setToken(reply.data.user.token)
      this.setUser(reply.data.user)
      this.setVerifiedToken(true)
      this.initTimeout()
    } else clearTimeout(this.timer)
  }

  @Action
  async initTimeout() {
    if (this.token) {
      clearTimeout(this.timer)
      const decodedToken = jwt_decode<JwtPayload>(this.token)
      const ttl: number =
        new Date((decodedToken.exp ?? 0) * 1000).valueOf() - Date.now()
      this.setTimer(
        setTimeout(() => {
          this.refreshToken()
        }, ttl * 0.9)
      )
    }
  }

  @Action
  async login({ carnet: username, password }: ILoginForm) {
    this.setLoggingIn(true)
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/auth/signin", { username, password }),
      options: {
        hideAlert: false,
      },
    })
    if (success) {
      this.setToken(reply.data.user.token)
      this.setUser(reply.data.user)
      this.setVerifiedToken(success)
      if (reply.data.user.role.name === "securityAgent")
        router.push({ name: "NewsTable" })
      else router.push({ name: "CheckInOutHistory" })
      this.initTimeout()
      ElMessage({
        message: `Ha iniciado sesión con ${this.user?.username}`,
        type: "success",
      })
    }
    this.setLoggingIn(false)
  }

  @Action
  localLogout() {
    this.setToken(undefined)
    this.setVerifiedToken(false)
    this.setUser(null)
    ElMessage({
      message: "Se ha deslogueado por sesión caducada",
      type: "warning",
    })
    router.push("/authentication/login")
  }
  @Action
  async logout() {
    clearTimeout(this.timer)
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.post("/auth/singout"),
      options: {
        hideAlert: true,
      },
    })
    if (success) {
      this.setToken(undefined)
      this.setVerifiedToken(false)
      this.setUser(null)
      ElMessage({ message: "Se ha deslogueado correctamente", type: "warning" })
      router.push("/authentication/login")
    } else {
      ElMessage({
        message: "No se ha deslogueado correctamente",
        type: "error",
      })
    }
  }

  @Action
  async saveSession() {
    if (!this.token) return undefined
    console.group("**** token ****")
    console.log(this.isAuthenticated)
    console.groupEnd()
    switch (this.isAuthenticated) {
      case Session.UNVERIFIED: {
      }
      case Session.VERIFIED: {
        try {
          await this.validateToken()
          return this.token
        } catch (error) {
          console.error(error)
          return undefined
        }
      }
      case Session.INVALID:
        return undefined
    }
  }
}

export const AuthModule = getModule(Auth)
