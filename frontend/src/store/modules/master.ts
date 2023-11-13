import { Action, Mutation, VuexModule } from "vuex-module-decorators"
import { handleRequests, OptionsHandleRequest } from "@/utils/utils"
import { AxiosError, AxiosResponse } from "axios"

export interface IError {
  message: string
}
export function ApiController(constructor: Function) {
  constructor.prototype.handleRequest = () => {}
}

function MasterAction() {
  return Action as any
}

export default class Master extends VuexModule {
  loading = false
  error?: IError

  get isLoading() {
    return this.loading
  }

  get getError() {
    return this.error?.message ?? ""
  }

  @Mutation
  setLoading(value: boolean) {
    this.loading = value
  }

  @Mutation
  setError(value: IError | string | undefined = undefined) {
    this.error = typeof value === "string" ? { message: value } : value
  }

  @MasterAction()
  async handleRequest<T>({
    request,
    options,
  }: {
    request: Promise<AxiosResponse<T>>
    options?: OptionsHandleRequest
  }): Promise<
    | { success: false; reply: AxiosError<any> }
    | { success: true; reply: AxiosResponse<T> }
  > {
    this.context.commit("setLoading", true)
    const result = await handleRequests(request, options)
    const { reply, success } = result
    this.context.commit("setLoading", false)
    if (!success) {
      this.context.commit("setError", {
        message: reply.response?.data?.error?.message ?? reply.message,
      })
      return { success, reply }
    }
    return { success, reply: reply }
  }
}
