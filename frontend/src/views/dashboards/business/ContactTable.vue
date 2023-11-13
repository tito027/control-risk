<script setup lang="ts">
import BaseTable from "@/components/tables/Base.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { Modals, ModalState } from "@/types/components"
import { FormModule, ModalType } from "@/store/modules/FormModule"
import { ConfirmModalModule } from "@/store/modules/ConfirmModal"
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>()

const router = useRouter()
const businessIdValue = ref("")

function openModalNewBusinessContact() {
  emits("changeModal", {
    modal: "formBusinessContactModal",
    payload: {
      show: true,
      isEdit: false,
      payload: { _id: businessIdValue.value },
    },
  })
}

const rowOptions = [
  {
    name: "Editar",
    icon: "fas fa-edit mx-1",
    function: (values: any) => {
      console.log("entra aqui en edit true")
      emits("changeModal", {
        modal: "formBusinessContactModal",
        payload: { show: true, isEdit: true, payload: values },
      })
    },
  },
]

function setBusinessIdValue() {
  const query: any = router.currentRoute.value.query
  const { business } = query
  businessIdValue.value = business
}
onBeforeMount(() => {
  setBusinessIdValue()
})
</script>
<template>
  <div class="py-4 container-fluid">
    <div class="mt-4 row">
      <div class="col-12">
        <div class="card">
          <!-- Card header -->
          <div
            class="card-header d-flex align-items-center justify-content-between w-100"
          >
            <div>
              <h5 class="mb-0">Listado de contactos</h5>
              <p class="mb-0 text-sm">
                A continuación se listan todos las contactos.
              </p>
            </div>
            <argon-button
              @click="openModalNewBusinessContact"
              class="btn btn-sm btn-primary mb-0 ms-auto"
            >
              Nuevo contacto
              <i class="fas fa-plus ps-1" />
            </argon-button>
          </div>
          <div class="table-responsive">
            <base-table
              :columns="[
                {
                  label: 'Nombre',
                  prop: 'contactName',
                  minWidth: 100,
                },
                {
                  label: 'Email',
                  prop: 'contactEmail',
                  minWidth: 100,
                },
                {
                  label: 'Teléfono',
                  prop: 'contactPhone',
                  minWidth: 100,
                },
              ]"
              :options="rowOptions"
              :endpoint="`/business/contacts/table/${businessIdValue}`"
              :hide-default-options="true"
            >
            </base-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
