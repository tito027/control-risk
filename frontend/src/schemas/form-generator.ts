import yup from "@/utils/yup"
import { Field } from "@/types/components"

export const generateDynamicSchema = (fields: Field[]) => {
  const schema: { [k: string]: any } = {}
  fields.forEach(field => {
    if (!field.validate) return
    const { required, ...validations } = field.validate
    const validator = Object.entries(validations).reduce(
      (acc, [key, value]) => {
        if (key === "regex" && Array.isArray(value))
          return acc["matches"](new RegExp(value.shift() as string), ...value)
        return acc[key](...(Array.isArray(value) ? value : [value]))
      },
      yup[
        field.type === "date" || field.type === "datetime"
          ? "date"
          : field.type === "multioptions"
          ? "array"
          : field.type === "number"
          ? "number"
          : "string"
      ]() as any
    )
    const req =
      typeof required === "string"
        ? required
        : `El campo ${field.name} es obligatorio`
    if (required && field.type === "multioptions")
      return (schema[field.name] = validator.required(req).min(1, req))
    schema[field.name] = required
      ? validator.required(req)
      : validator.notRequired()
  })
  return yup.object().shape(schema)
}
