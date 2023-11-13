<script lang="ts" setup>
import { Form } from "vee-validate"
import { generateDynamicSchema } from "@/schemas/form-generator"
import { IndexType } from "@/types/app"
import { ElMessage } from "element-plus"
import { computed, ref } from "vue"
import ArgonButton from "@/components/ArgonButton.vue"
import useModelValue from "@/composables/ModelValueSync"
import useFormModal from "@/composables/FormModalComposable"
import { Field } from "@/types/components"
import { AgencyModule } from "@/store/modules/Agencies"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", payload: boolean): void
}>()

// ===> data
const columnClasses = "col-lg-6 col-md-6 col-12"
const loading = ref(false)
const fields = computed<{ [k: string]: Field }>(() => ({
  latitude: {
    label: "Latitud:",
    name: "latitude",
    type: "text",
    value: AgencyModule.overview?.latitude.toString(),
  },
  longitude: {
    label: "Longitud:",
    name: "longitude",
    type: "text",
    value: AgencyModule.overview?.longitude.toString(),
  },
}))

const { state, getComponent, getProps, hiddenInput } = useFormModal()
const { value } = useModelValue(props, "modelValue", emit)

// ===> Methods
async function onSubmit(params: IndexType<any>) {
  loading.value = true
  // consts
  const response = await AgencyModule.upgradeOverview({
    latitude: params.latitude,
    longitude: params.longitude,
  })
  if (response.success)
    // Update Fields
    ElMessage({
      message: "La información se ha actualizado exitosamente!",
      showClose: true,
      type: "success",
    })
  loading.value = false
}
</script>
<template>
  <div class="card-body pt-0 files-list">
    <Form
      class="w-100"
      :validation-schema="generateDynamicSchema(Object.values(fields))"
      @submit="onSubmit"
      v-slot="{ values, setFieldValue }"
    >
      <div class="w-100">
        <div class="row m-0">
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
              ...(columnClasses
                ? { [columnClasses]: true }
                : { 'col-xl-4 col-lg-6 col-md-6 col-12': true }),
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
        </div>
        <div class="w-100">
          <div class="p-3">
            <GMapMap
              :center="{
                lat: !Number.isNaN(parseFloat(values.latitude))
                  ? parseFloat(values.latitude)
                  : 0,
                lng: !Number.isNaN(parseFloat(values.longitude))
                  ? parseFloat(values.longitude)
                  : 0,
              }"
              :zoom="15"
              style="width: 80%; height: 250px"
              :options="{
                gestureHandling: 'greedy',
              }"
            >
              <GMapMarker
                :position="{
                  lat: !Number.isNaN(parseFloat(values.latitude))
                    ? parseFloat(values.latitude)
                    : 0,
                  lng: !Number.isNaN(parseFloat(values.longitude))
                    ? parseFloat(values.longitude)
                    : 0,
                }"
              />
            </GMapMap>
          </div>
        </div>
      </div>
      <div class="d-flex pt-4 justify-content-between">
        <argon-button color="light" @click="value = false">
          <span class="text-black">Cancelar</span>
        </argon-button>
        <argon-button :color="'primary'" native-type="submit">
          Guardar
        </argon-button>
      </div>
    </Form>

    <!-- <hr class="horizontal dark my-2" /> -->
  </div>
</template>
<style>
.vue-map-container {
  display: flex;
  justify-content: center;
}
</style>
