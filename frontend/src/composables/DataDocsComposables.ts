import { AgentsModule } from "@/store/modules/Agents"
import { AlertState, ExpireTime } from "@/types/app"
import { Field, InputTypes } from "@/types/components"
import { DateTime } from "luxon"
import { computed, ComputedRef } from "vue"

export type DocsProps = Record<
  string,
  { type: string; file: string; name: string; data?: Record<string, any> }
>
export type FormItemDocProps = {
  keyDoc: string
  title: string
  icon: string
  state: AlertState
  hints?: { [k in AlertState]?: string }
  itemProps: {
    inputs: {
      [k: string]: Field<InputTypes>
    }
    updateUser: boolean
    category: string
  }
}

export function getAlertStateForET(
  et?: ExpireTime,
  defaultMessage: string = "El documento se encuentra en regla"
): AlertState {
  if (!et) return AlertState.error
  return (
    {
      [ExpireTime.EXPIRE]: AlertState.error,
      [ExpireTime.SOON]: AlertState.warning,
      [ExpireTime.LATER]: AlertState.info,
      [ExpireTime.FINE]: AlertState.success,
    } as { [k in ExpireTime]: AlertState }
  )[et]
}
export function getExpirationTime(date?: string): ExpireTime | undefined {
  if (!date) return undefined
  const daysToExpire = DateTime.fromISO(date).diffNow("days").days
  if (daysToExpire <= 0) return ExpireTime.EXPIRE
  else if (daysToExpire < 30) return ExpireTime.SOON
  else if (daysToExpire < 120) return ExpireTime.LATER
  return ExpireTime.FINE
}

export default function (): {
  items: FormItemDocProps[]
  docs: ComputedRef<DocsProps>
} {
  const docs = computed(
    () =>
      AgentsModule.getUserInformation?.docs?.reduce(
        (acc, curr) => {
          acc[curr.type] = curr
          return acc
        },
        {} as Record<
          string,
          {
            type: string
            file: string
            name: string
            data?: Record<string, any>
          }
        >
      ) ?? {}
  )
  return {
    docs,
    items: [
      // ========= INIT - DRIVER LICENSE ========= //
      {
        title: "Licencia de conducir",
        keyDoc: "driverLicense",
        icon: "fas fa-certificate",
        state: getAlertStateForET(
          getExpirationTime(
            AgentsModule.getAgentOverview?.userinformation?.expirationDriverLicense?.toString()
          )
        ),
        hints:
          !AgentsModule.getAgentOverview?.userinformation?.expirationDriverLicense?.toString()
            ? {
                [AlertState.error]:
                  "No se posee copia del documento de licencia de conducir",
              }
            : undefined,
        itemProps: {
          updateUser: true,
          category: "driverLicense",
          inputs: {
            driver: {
              type: "text",
              name: "driverLicense",
              label: "Número de licencia: ",
              value:
                AgentsModule.getAgentOverview?.userinformation.driverLicense?.toString() ??
                "",
              size: "sm",
              className: "form-group w-50 px-1",
              validate: {
                regex: [
                  /^(\d{8}-\d)|(\d{4}-\d{6}-\d{3}-\d)$/i,
                  "Ingrese un identificativo válido",
                ],
              },
            },
            expirationDriverLicense: {
              type: "date",
              name: "expirationDriverLicense",
              label: "Vencimiento de la licencia:",
              value:
                AgentsModule.getAgentOverview?.userinformation?.expirationDriverLicense?.toString(),
              classPicker: "w-100",
              validate: {
                min: [new Date(), "Debe ingresar una fecha no menor a hoy"],
              },
              format: "DD/MM/YYYY",
            },
            driverLicense: {
              type: "file",
              name: "driverLicenseFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.driverLicense,
              limit: 1,
            },
          },
        },
      },
      // ========= END - DRIVER LICENSE ========= //

      // ========= INIT - CONTRACT ========= //
      {
        title: "Contrato individual",
        keyDoc: "contract",
        icon: "fas fa-file-contract",

        state:
          !AgentsModule.getAgentOverview?.userinformation?.expirationDriverLicense?.toString()
            ? AlertState.warning
            : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee copia del contrato individual",
          [AlertState.success]: "El agente ya posee copia del contrato anexado",
        },
        itemProps: {
          category: "contract",
          updateUser: false,
          inputs: {
            contract: {
              type: "text",
              name: "contractId",
              label: "Identificativo",
              value: docs.value.contract?.data?.contractId ?? "",
              size: "sm",
              className: "form-group w-50 px-1",
              validate: {
                min: 3,
              },
            },
            dateContract: {
              type: "date",
              name: "contractDate",
              label: "Fecha de firma",
              value: docs.value.contract?.data?.contractDate ?? "",
              classPicker: "w-100",
              validate: {
                max: [new Date(), "Debe ingresar una fecha no mayor a hoy"],
              },
              format: "DD/MM/YYYY",
            },
            contractFile: {
              type: "file",
              name: "contractFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.contract,
              limit: 1,
            },
          },
        },
      },
      // ========= END - CONTRACT ========= //

      // ========= INIT - Dedactilar ========= //
      {
        title: "Tarjeta dedactilar",
        keyDoc: "contract",
        icon: "fas fa-fingerprint",
        state: !docs.value.dedactilar ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee tarjeta dedactilar",
          [AlertState.success]: "El agente ya posee anexa tarjeta dedactilar",
        },
        itemProps: {
          category: "dedactilar",
          updateUser: false,
          inputs: {
            dedactilarFile: {
              type: "file",
              name: "dedactilarFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.dedactilar,
              limit: 1,
            },
          },
        },
      },
      // ========= END - Dedactilar ========= //

      // ========= INIT - LIFE INSURANCE ========= //
      {
        title: "Seguro de vida",
        keyDoc: "lifeinsurance",
        icon: "fas fa-ambulance",
        state: !docs.value.lifeinsurance
          ? AlertState.warning
          : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee seguro de vida",
          [AlertState.success]: "El agente ya posee anexo el seguro de vida",
        },
        itemProps: {
          category: "lifeinsurance",
          updateUser: false,
          inputs: {
            insurance: {
              type: "file",
              name: "insuranceFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.lifeinsurance,
              limit: 1,
            },
          },
        },
      },
      // ========= END - LIFE INSURANCE ========= //

      // ========= INIT - Birth Doc ========= //
      {
        title: "Partida de nacimiento",
        keyDoc: "birthDoc",
        icon: "fas fa-certificate",
        state: !docs.value.birthDoc ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee copia de la partida de nacimiento",
          [AlertState.success]:
            "El agente ya posee copia de partida de nacimiento",
        },
        itemProps: {
          category: "birthDoc",
          updateUser: false,
          inputs: {
            birthDoc: {
              type: "file",
              name: "birthDocFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.birthDoc,
              limit: 1,
            },
          },
        },
      },
      // ========= END - Birth Doc ========= //

      // ========= INIT - Medical Records ========= //
      {
        title: "Constancias Médicas",
        keyDoc: "medicalRecords",
        icon: "fas fa-notes-medical",
        state: !docs.value.medicalRecords
          ? AlertState.warning
          : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee constancias médicas",
          [AlertState.success]:
            "El agente ya posee registros de constancias médicas",
        },
        itemProps: {
          category: "medicalRecords",
          updateUser: false,
          inputs: {
            medicalRecords: {
              type: "file",
              name: "medicalRecordsFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.medicalRecords,
              limit: 1,
            },
          },
        },
      },
      // ========= END - Medical Records ========= //

      // ========= INIT - DUI ========= //
      {
        title: "Documento único de identidad",
        keyDoc: "dui",
        icon: "fas fa-id-card",
        state: !docs.value.dui ? AlertState.warning : AlertState.success,
        hints: !docs.value.dui
          ? {
              [AlertState.warning]: "No se posee copia del DUI",
            }
          : undefined,
        itemProps: {
          updateUser: true,
          category: "dui",
          inputs: {
            dui: {
              type: "text",
              name: "dui",
              label: "Documento único de identidad: ",
              value:
                AgentsModule.getAgentOverview?.userinformation.dui?.toString() ??
                "",
              size: "sm",
              className: "form-group w-50 px-1",
              validate: {
                regex: [/^(\d{8}-\d)$/i, "Ingrese un identificativo válido"],
              },
            },
            duiFile: {
              type: "file",
              name: "duiFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.dui,
              limit: 1,
            },
          },
        },
      },
      // ========= END - DUI ========= //

      // ========= INIT - ISSS ========= //
      {
        title: "Tarjeta ISSS",
        keyDoc: "isss",
        icon: "fas fa-file-medical-alt",
        state: !docs.value.isss ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]:
            "No se posee copia de la tarjeta del seguro social",
          [AlertState.success]:
            "El agente ya posee anexa la copia de la tarjeta",
        },
        itemProps: {
          category: "isss",
          updateUser: false,
          inputs: {
            isss: {
              type: "file",
              name: "isssFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.isss,
              limit: 1,
            },
          },
        },
      },
      // ========= END - ISSS ========= //

      // ========= INIT - AFP ========= //
      {
        title: "Tarjeta AFP",
        keyDoc: "afp",
        icon: "fas fa-file-invoice-dollar",
        state: !docs.value.afp ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee copia de la tarjeta del AFP",
          [AlertState.success]:
            "El agente ya posee anexa la copia de la tarjeta",
        },
        itemProps: {
          category: "afp",
          updateUser: false,
          inputs: {
            afp: {
              type: "file",
              name: "afpFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.afp,
              limit: 1,
            },
          },
        },
      },
      // ========= END - AFP ========= //

      // ========= INIT - POLICE SOLVENCY ========= //
      {
        title: "Solvencia policial",
        keyDoc: "polsolv",
        icon: "far fa-file-alt",
        state: !docs.value.polsolv ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee copia de antecedentes policiales",
          [AlertState.success]:
            "El agente ya posee anexa la copia de antecedentes",
        },
        itemProps: {
          category: "polsolv",
          updateUser: false,
          inputs: {
            polsolv: {
              type: "file",
              name: "polsolvFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.polsolv,
              limit: 1,
            },
          },
        },
      },
      // ========= END - POLICE SOLVENCY ========= //

      // ========= INIT - CRIMINAL RECORDS ========= //
      {
        title: "Antecedentes penales",
        keyDoc: "crirecords",
        icon: "fas fa-file",
        state: !docs.value.crirecords ? AlertState.error : AlertState.success,
        hints: {
          [AlertState.error]: "No se posee copia de antecedentes penales",
          [AlertState.success]:
            "El agente ya posee anexa la copia de antecedentes",
        },
        itemProps: {
          category: "crirecords",
          updateUser: false,
          inputs: {
            crirecords: {
              type: "file",
              name: "crirecordsFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.crirecords,
              limit: 1,
            },
          },
        },
      },
      // ========= END - CRIMINAL RECORDS ========= //

      // ========= INIT - SCHOOL CERTIFICATE ========= //
      {
        title: "Certificado escolar",
        keyDoc: "schoolcert",
        icon: "fas fa-graduation-cap",
        state: !docs.value.schoolcert ? AlertState.warning : AlertState.success,
        hints: {
          [AlertState.warning]: "No se posee copia de certificación escolar",
          [AlertState.success]:
            "El agente ya posee anexa la copia de la certificación",
        },
        itemProps: {
          category: "schoolcert",
          updateUser: false,
          inputs: {
            schoolcert: {
              type: "file",
              name: "schoolcertFile",
              label: "Seleccione un archivo",
              autoUpload: false,
              value: docs.value.schoolcert,
              limit: 1,
            },
          },
        },
      },
      // ========= END - CRIMINAL RECORDS ========= //
    ],
  }
}
