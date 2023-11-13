import { IEnv } from "./model"

export default {
  DB: true,
}

const { VITE_API_GATEWAY = "http://localhost:3010" } = import.meta.env

export const env: IEnv = {
  apiGateway: VITE_API_GATEWAY,
}
