export function getStatusText(row: any) {
  if (row.status === "New") {
    return "Nuevo"
  } else if (row.status === "Used") {
    return "Usado"
  } else if (row.status === "Expired") {
    return "Vencido"
  } else {
    return ""
  }
}
export function getStatusColor(row: any) {
  if (row.status === "New") {
    return "success" // verde para Nuevo
  } else if (row.status === "Used") {
    return "warning" // amarillo para Usado
  } else if (row.status === "Expired") {
    return "danger" // rojo para Vencido
  } else {
    return "" // color por defecto si no coincide con ninguna opción
  }
}
