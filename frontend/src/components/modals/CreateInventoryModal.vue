<script lang="ts" setup>
import { Field, ModalState, Modals } from "@/types/components"
import FormModal from "./FormModal.vue"
import ApiGateway from "@/store/api"
import { ElMessage, selectKey } from "element-plus"
import { onMounted, ref } from "vue"
import { AuthModule } from "@/store/modules/Auth"
import { TablesModule } from "@/store/table/Table"
import * as XLSX from "xlsx"

// props
const props = defineProps<{ state: ModalState }>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: ModalState): void
}>()

// state
const loading = ref(false)

const fields: { [k: string]: Field } = {
  file: {
    type: "file",
    name: "file",
    label: "Seleccione un archivo",
    tip: "Solo se aceptan formato Excel",
    indication: "Cargar inventario",
    accept: ".xlsx",
    autoUpload: false,
    value: "",
    limit: 1,
  },
  type: {
    label: "Tipo de invetario a cargar",
    type: "options",
    placeholder: "Seleccione los items correspondiente al inventario",
    name: "type",
    url: "items/types",
    options: {
      label: "label",
      key: "value",
    },    
  },
}

const data: any[] = [
  {
    name: "jayanth",
    data: "scd",
    abc: "sdef",
  },
]

onMounted(() => {
  if (props.state.payload.type) {
    /** cargo los valores para el edit */

    delete fields['type']
  }
})

const onSubmit = (payload: any) => {
  loading.value = true
  const route = "/inventory"
  const {type} = props.state.payload
  payload.user_id = AuthModule.id
  payload.date = new Date().toISOString()
  payload.type = type
  const selectedFile = payload.file[0] // Usar el primer elemento de payload.file
  // Convertir selectedFile a Blob
  const blobFile = new Blob([selectedFile.raw], { type: selectedFile.type })
  XLSX.utils.json_to_sheet(data, "out.xlsx")
  let items: any = []
  //debugger
  if (blobFile) {
    let fileReader = new FileReader()
    fileReader.readAsBinaryString(blobFile) // Usar readAsBinaryString en lugar de readAsArrayBuffer
    fileReader.onload = (event: any) => {
      let data = event.target.result
      let workbook = XLSX.read(data, { type: "binary" }) // Usar type: "binary" en lugar de type: "array"
      const sheets = [workbook.SheetNames[0]]
      sheets.forEach(sheet => {
        let rowObject: any = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
          header: 1,
        })
        rowObject = rowObject.filter((row: any) => row[0])
        const keys: any = rowObject[0]
        items.push(
          ...rowObject.slice(1).map((values: string[]) => {
            const obj: any = {}
            keys.map((key: string, index: number) => {
              obj[key.toLowerCase().split(" ").join("_")] = values[index]
            })
            return obj
          })
        )
        payload.items = items
        ApiGateway.post(route, payload)
          .then(response => {
            if (response.data.status) {
              emits("changeModal", { show: false })
              TablesModule.setReload(true)
              ElMessage({
                message: `Se ha creado correctamente!!!`,
                type: "success",
              })
            }
          })
          .catch(error => {
            ElMessage({
              message: "No se pudo crear correctamente!!",
              type: "error",
            })
          })
          .finally(() => {
            loading.value = false
          })
      })
    }
  }
}

const getTitle = (status: boolean = false) => {
  return status ? "Asignar" : "Cargar"
}
</script>
<template>
  <form-modal
    :show="state.show"
    :title="getTitle(state.isEdit)"
    modal-name="formInventoryModal"
    column-classes="col-lg-6 col-md-6 col-12"
    :inputs="fields"
    :loading="loading"
    @change-modal="p => emits('changeModal', p.payload)"
    @submit="onSubmit"
  />
</template>
