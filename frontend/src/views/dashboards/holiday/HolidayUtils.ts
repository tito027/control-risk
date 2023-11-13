export function getTagType(
  row: any
): "" | "success" | "warning" | "info" | "danger" {
  if (row.is_pending && !row.is_rejected) {
    return "info" // Pendiente
  } else if (!row.is_pending && row.is_rejected) {
    return "danger" // Rechazado
  } else if (!row.is_pending && !row.is_rejected) {
    return "success" // Aprobado
  } else {
    return "info" // Pendiente
  }
}
