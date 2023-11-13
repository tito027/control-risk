import * as yup from "yup"

export function confirmSchema(params: ["inSite" | "inTime", boolean][]) {
  return yup.object().shape({
    password: yup.string().required("Contraseña requerida!"),
    inSite:
      params.findIndex(([key, value]) => key === "inSite" && value) > -1
        ? yup.string().required("Ingrese una razón de fuera de sitio")
        : yup.string(),
    inTime:
      params.findIndex(([key, value]) => key === "inTime" && value) > -1
        ? yup.string().required("Ingrese una razón de fuera de tiempo")
        : yup.string(),
  })
}
