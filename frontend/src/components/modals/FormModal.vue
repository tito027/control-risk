<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue"
import ArgonButton from "../ArgonButton.vue"
import ArgonInput from "../ArgonInput.vue"
import ArgonCheckbox from "../ArgonCheckbox.vue"
import Select from "../SelectControlled.vue"
import MultiOptions from "../SelectMultipleGroup.vue"
import { Form } from "vee-validate"
import { Field, Modals, ModalState, SelectProps } from "@/types/components.d"
import { generateDynamicSchema } from "@/schemas/form-generator"
import ArgonDatePicker from "@/components/ArgonDatePicker.vue"
import { ElLoading } from "element-plus"
import useFormModal from "@/composables/FormModalComposable"
import { ArgonUploadProps as UploadProps } from "@/components/ArgonUpload.vue"
import { getDateOrUndefined, getFileOrUndefined } from "@/utils/utils"

let loadingService: ReturnType<(typeof ElLoading)["service"]>

const { getComponent, getProps, hiddenInput, state } = useFormModal()

const props = withDefaults(
  defineProps<{
    show?: boolean
    modalName: Modals
    title: string
    columnClasses?: string
    width?: number
    inputs: { [k: string]: Field }
    loading: boolean
    submitButtonText?: string
    submitButtonColor?: string
    specialButtonShow?: boolean
    specialButtonColor?: string
    specialButtonText?: string
  }>(),
  {
    specialButtonShow: false,
  }
)

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
  (e: "submit", t: FormPayload): void
  (e: "specialSubmit", t: FormPayload): void
}>()

const fields = computed<{ [k: string]: Field }>(() => props.inputs)

const dialogFormVisible = ref(props.show)

// types
type FormPayload = {
  [k: string]: any
}

// state
const loading = computed(() => props.loading)

const formState = computed(() => state.value)

watch(
  () => props.show,
  () => {
    dialogFormVisible.value = props.show
  }
)

watch(
  () => loading.value,
  loading => {
    if (loading)
      loadingService = ElLoading.service({
        target: `.${props.modalName}`,
        lock: true,
        text: "Cargando...",
        background: "rgba(255, 255, 255, 0.6)",
        customClass: "modal-loading",
      })
    else !!loadingService && loadingService.close()
  }
)
function onSubmit(e: any) {
  emits("submit", e)
}

function onSpecialSubmit(e: any) {
  emits("specialSubmit", e)
}
</script>
<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="title"
    :width="width ? `${width}%` : '80%'"
    :class="`${modalName}`"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @close="
      emits('changeModal', {
        modal: modalName,
        payload: { show: false },
      })
    "
    align-center
  >
    <Form
      class="w-100"
      :validation-schema="generateDynamicSchema(Object.values(fields))"
      @submit="(e: any) => emits('submit', e)"
      v-slot="{ values, setFieldValue }"
    >
      <div class="w-100">
        <div class="row m-0">
          <slot name="header"></slot>
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
              :id="input.type + '_' + index"
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
          <slot></slot>
        </div>
        <div class="d-flex pt-4 justify-content-between">
          <argon-button color="light" @click="dialogFormVisible = false">
            <span class="text-black">Cancelar</span>
          </argon-button>

          <div>
            <argon-button
              v-if="specialButtonShow"
              class="ml-auto"
              native-type="button"
              @click="() => onSpecialSubmit(values)"
              :color="specialButtonColor ? specialButtonColor : 'primary'"
            >
              {{ specialButtonText }}
            </argon-button>
            <argon-button
              :color="submitButtonColor ? submitButtonColor : 'primary'"
              native-type="submit"
            >
              {{ submitButtonText || "Guardar" }}
            </argon-button>
          </div>
        </div>
      </div>
    </Form>
  </el-dialog>
</template>
<style lang="scss">
.modal-loading {
  border-radius: 15px;
}
</style>
