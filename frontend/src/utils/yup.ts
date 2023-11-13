import * as yup from "yup"

yup.addMethod(
  yup.string,
  "min",
  function (
    min: number,
    errorMessage = `Ingrese por lo menos ${min} caracteres`
  ) {
    return this.test(`min`, errorMessage, function (value = "") {
      const { path, createError } = this
      if (!value) return true
      const valid = new RegExp(`.{${min},}`).test(value)
      return (
        valid ||
        createError({
          path,
          message: errorMessage,
        })
      )
    })
  }
)
yup.addMethod(
  yup.string,
  "max",
  function (max: number, errorMessage = `No ingrese más de ${max} caracteres`) {
    return this.test(`max`, errorMessage, function (value = "") {
      const { path, createError } = this
      const valid = new RegExp(`^.{0,${max}}$`).test(value)
      return (
        valid ||
        createError({
          path,
          message: errorMessage,
        })
      )
    })
  }
)
yup.addMethod(
  yup.number,
  "decimalAllows",
  function (numDecimals: number, errorMessage = `El número máximo de decimales que puedes utilizar es de ${numDecimals}`) {
    return this.test("decimalAllows", errorMessage, function(value) {
      const { path, createError } = this
      const patternDigisAfterComma = new RegExp(`^(-)?\\d+(\\.\\d{0,${numDecimals}})?$`)
      let valid = false;
      if(value || value === 0)
        valid = patternDigisAfterComma.test(value.toString())
      return (
        valid ||
        createError({
          path,
          message: errorMessage
        })
      )
    })
  }
)

export default yup