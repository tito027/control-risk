import { env } from "@/config"
import axios from "axios"
export default axios.create({
  baseURL: env.apiGateway,
})
