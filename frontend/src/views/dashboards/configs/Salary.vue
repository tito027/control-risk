<script lang="ts" setup>
import useFormModal from "@/composables/FormModalComposable"
import { Form } from "vee-validate"
import ArgonButton from "@/components/ArgonButton.vue"
import { Field } from "@/types/components"
import { computed, onMounted } from "vue"
import { generateDynamicSchema } from "@/schemas/form-generator"
import { ConfigModule } from "@/store/modules/Configs"
import { max } from "moment"
import { ElMessage } from "element-plus"
// ===> Data
const { state, getComponent, getProps, hiddenInput } = useFormModal()

// ===> Computed
const fields = computed<{ [k: string]: Field }>(() =>
  ConfigModule.salaries.reduce((acc, curr) => {
    acc[curr._id] = {
      label: `${curr.name}`,
      name: `${curr._id}`,
      type: "number",
      validate: {
        decimalAllows: [2, "Indique una cifra válida"],
        min: [0, "Ingrese una cifra válida"],
      },
      value: curr.amount.toString(),
    }
    return acc
  }, {} as { [k: string]: Field<"number"> })
)

// ===> Methods

async function onSubmit(payload: { [k: string]: string }) {
  const response = await ConfigModule.updateManySalaries(
    Object.fromEntries(
      Object.entries(payload).map(([key, val]) => [
        key,
        { amount: parseFloat(val) },
      ])
    )
  )
  if (response.success) {
    ElMessage({
      message: "Salarios actualizados con éxito!",
      type: "success",
    })
  } else {
    ElMessage({
      message: "Algo salió mal no se pudieron actualizar los datos!",
      type: "error",
    })
  }
}

onMounted(() => ConfigModule.fetchSalariesConf())
</script>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-6">
        <h4 class="text-white">Configuraciones generales</h4>
        <p class="text-white">
          Configura diversos puntos del sistema desde esta página.
        </p>
      </div>
    </div>
    <div class="mt-4 row">
      <div class="col-sm-4">
        <div class="card">
          <div class="card-body">
            <h5 class="font-weight-bolder">Salarios</h5>
            <hr />
            <Form
              class="w-100"
              :validation-schema="generateDynamicSchema(Object.values(fields))"
              @submit="onSubmit"
              v-slot="{ values, setFieldValue }"
            >
              <div
                v-for="(input, index) in fields"
                :class="{
                  'd-none':
                    input.hidden &&
                    hiddenInput(
                      input.name,
                      input.type,
                      input.hidden,
                      values,
                      setFieldValue
                    ),
                  'col-12': true,
                }"
                :key="index"
              >
                <component
                  :hidden="
                    input.hidden &&
                    hiddenInput(
                      input.name,
                      input.type,
                      input.hidden,
                      values,
                      setFieldValue
                    )
                  "
                  :is="getComponent(input.type)"
                  :class="{
                    'upload-control w-100': input.type === 'file',
                    ...(input.className ? { [input.className]: true } : {}),
                  }"
                  v-bind="getProps(input, values)"
                  :name="input.name"
                  :type="input.type"
                  :label="input.label"
                  :placeholder="input.placeholder"
                  small-label
                />
              </div>

              <div class="d-flex pt-4 justify-content-end">
                <argon-button :color="'primary'" native-type="submit">
                  Guardar
                </argon-button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
