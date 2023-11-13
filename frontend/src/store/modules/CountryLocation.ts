import { store } from "@/store"
import {
  Module,
  Mutation,
  getModule,
  Action,
  MutationAction,
} from "vuex-module-decorators"
import axios from "axios"
import Master from "@/store/modules/master"
import { env } from "@/config"

const ApiCatalogue = axios.create({ baseURL: "https://api.salud.gob.sv" })
const ApiGateway = axios.create({ baseURL: env.apiGateway })

@Module({ dynamic: true, namespaced: true, name: "CountryLocation", store })
export class CountryLocation extends Master {
  departments: any[] = []
  departmentsV2API: any[] = []
  municipalities: any[] = []
  municipalitiesV2API: any[] = []

  @Action
  async getDepartments() {
    const { reply, success } = await this.handleRequest({
      request: ApiCatalogue.get("/departamentos?idPais=68"),
      showAlert: false,
    })
    if (success) {
      this.setDepartments(reply.data)
    }
  }

  @Action
  async getDepartmentsByAPI() {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get("/payrolls/modals/departments"),
    })

    if (success) {
      this.setDepartmentsByAPI(reply.data)
    }
  }

  @Action
  async getMunicipalities(idDepartment: number) {
    const { reply, success } = await this.handleRequest({
      request: ApiCatalogue.get(`/municipios?idDepartamento=${idDepartment}`),
      showAlert: false,
    })
    if (success) {
      this.setMunicipalities(reply.data)
    }
  }

  @Action
  async getMunicipalitiesByAPI(idDepartment: string) {
    const { reply, success } = await this.handleRequest({
      request: ApiGateway.get(
        `/payrolls/modals/municipalities?department=${idDepartment}`
      ),
    })
    if (success) {
      this.setMunicipalitiesByAPI(reply.data)
    }
  }

  get Departments() {
    return this.departments
  }

  get DepartmentsByAPI() {
    return this.departmentsV2API
  }

  get Municipalities() {
    return this.municipalities
  }

  get MunicipalitiesByAPI() {
    return this.municipalitiesV2API
  }

  @Mutation
  setDepartments(data: any) {
    this.departments = data.sort((a: any, b: any) =>
      a.nombre.localeCompare(b.nombre)
    )
  }

  @Mutation
  setDepartmentsByAPI(data: any) {
    const dataCapitalized = data.map(
      (item: { label: string; value: string }) => {
        const str: string[] = item.label.split(" ")
        let label = str
          .map(
            text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
          )
          .join(" ")
        item.label = label
        return item
      }
    )
    this.departmentsV2API = dataCapitalized
  }

  @Mutation
  setMunicipalities(data: any) {
    this.municipalities = data.sort((a: any, b: any) =>
      a.nombre.localeCompare(b.nombre)
    )
  }

  @Mutation
  setMunicipalitiesByAPI(data: any) {
    const dataCapitalized = data.map(
      (item: { label: string; value: string }) => {
        const str: string[] = item.label.split(" ")
        let label = str
          .map(
            text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
          )
          .join(" ")
        item.label = label
        return item
      }
    )
    this.municipalitiesV2API = dataCapitalized
  }
}

export const CountryLocationModule = getModule(CountryLocation)
