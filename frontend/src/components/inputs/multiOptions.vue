<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid"
import { onMounted, reactive, ref, watch, computed } from "vue"
import { CascaderOption,ElMessage } from "element-plus"
import { Options, ControlOption } from "@/types/components"
import Select from '../SelectControlled.vue';
import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonInput from "@/components/ArgonInput.vue";

export type FormField = {
  type: number
  name?: string
  label?: string
  placeholder?: string
  id: string
  options?: ControlOption[]
  dependsOn?: string
  x?: string
  depends?: boolean
  regex?: string
}
const needResponseCheckbox = ref<boolean>(true);
const emits = defineEmits<{
  (e: "addControl", payload: number): void
  (e: "removeControl", payload: number): void
  (
    e: "updateControl",
    _: {
      index: number
      payload: Partial<
        FormField & {
          parentOption: string
        }
      >
    }
  ): void
}>()
function onEnter(e: InputEvent & { code: string; target: { value: any } }) {
  if (e.code === "Enter" && e.target.value.length) {
    e.preventDefault()
    addOption(e.target.value)
    e.target.value = ""
    showAddOpt.value = false
  }
}
const model = reactive<{
  dependsOn: boolean
  optionSelected: string[] | undefined
  controlSelected: string | undefined
}>({
  dependsOn: false,
  optionSelected: [],
  controlSelected: undefined,
})
const props = defineProps<{
  index: number
  value: FormField
  showDelete: boolean
  controls?: FormField[]
  options?: ControlOption[]
  parentOptions?: CascaderOption[]
}>()
function addOption(label: string) {
  const opt = {
    label: Boolean(needResponseCheckbox.value) ? label + " *": label,
    value: uuidv4(),
    needResponse: needResponseCheckbox.value,
    parent: model.optionSelected?.join("/"),
  } 
  emits("updateControl", {
    index: props.index,
    payload: {
      options: props.options?.concat(opt) ?? [opt],
      dependsOn: model.controlSelected,
      parentOption: model.optionSelected?.[0],
    },
  })
  ElMessage({
    showClose: true,
    message: "Opción agregada!",
    type: "info",
  })
}
function onInput(e: any) {
  showAddOpt.value = !!e.target.value.length
}
const iptOption = ref<(HTMLInputElement & { inputValue: string }) | null>(null)

const showAddOpt = ref<boolean>(false)

function addOnClick(e: any) {

  if (iptOption.value?.inputValue) {
    addOption(iptOption.value?.inputValue)
    iptOption.value.inputValue = ""
    showAddOpt.value = false
  }
}

function selectParent(control: string) {
  model.controlSelected = control
  emits("updateControl", {
    index: props.index,
    payload: { dependsOn: control, options: [] },
  })
}
function onSelectOption(e: string[]) {
  emits("updateControl", {
    index: props.index,
    payload: {
      options: props.options?.filter(opt => opt.value !== e[0]),
    },
  })
}
//Computed const
const optionControllers = computed<Options<FormField>[]>(() =>
  props.controls
    ? (props.controls
        .filter(
          ctrl =>
            ctrl.type === 1 &&
            ctrl.id !== (props.value?.name ?? `control-${props.index}`)
        )
        .map(ctrl => ({
          label: ctrl.name,
          value: ctrl,
        })) as Options<FormField>[])
    : []
)
const getName = computed(() => {
  // console.log("getname", props.value.id ?? "control-" + props.index)
  return props.value.id ?? "control-" + props.index
})
const cascaderOptions = computed<ControlOption[]>(() =>
  model.optionSelected
    ? props.options?.filter(
        opt => opt.parent === model.optionSelected?.join("")
      ) ?? []
    : props.options ?? []
)
</script>
<template>
        <div class="d-flex ">
          <argon-input
            class="w-100"
            ref="iptOption"
            groupClasses="w-100"
            name="Options"
            label="Digite una pregunta"
            placeholder="Presione enter para registrar"
            size="md"
            smallLabel
            bottomLabel
            @input="onInput"
            @keypress="onEnter"
          />
          <button
          v-if="showAddOpt"
          type="button"
          class="border-0 btn-action mt-2"
          :style="{ background: 'none' }"
          @click="addOnClick"
          >
            <i class="fas fa-plus-square text-primary hovered h3 ml-2 mb-0"></i>
          </button>

        </div>

        <div  class="d-flex flex-row">
          <argon-checkbox 
          id="needResponse" 
          class="w-100"        
          :checked="false"
          

          @change="(e: any) => (needResponseCheckbox = e.target.checked)"
          >Necesita respuesta</argon-checkbox>
        </div>
        <div v-if="optionControllers.length" class="d-flex align-items-center">
          <argon-checkbox
            :name="`${getName}.depends`"
            :value="Boolean(value.dependsOn?.length)"
            @change="(e: any) => (model.dependsOn = e.target.checked)"
          >
            Es opción dependiente
          </argon-checkbox>
          <Select
            :name="`${getName}.dependsOn`"
            placeholder="Seleccione la opción dependiente"
            input-group-classes="input-group"
            form-group-classes="w-100"
            :loading="false"
            :options="optionControllers"
            :value="value.dependsOn"
            :select-options="{
              size: 'small',
              valueKey: 'id',
              labelKey: 'name',
              multiple: false,
            }"
            :select="selectParent"
            v-if="model.dependsOn"
          />
        </div>
        <div
      v-if="value.type === 1"
      class="d-flex px-3 flex-column"
      style="flex: 0.5 1 0; align-self: stretch"
    >
      <div class="w-100">
        <el-cascader
          v-if="parentOptions?.length"
          class="w-100"
          v-model="model.optionSelected"
          :options="parentOptions"
        />
      </div>
      <el-cascader-panel
        v-if="cascaderOptions?.length"
        style="height: 100%"
        class="w-100"
        @change="onSelectOption"
        :options="cascaderOptions"
      >
      </el-cascader-panel>
      <el-empty v-else :image-size="150" class="p-0 m-0" description="Sin opciones agregadas"></el-empty>
    </div>
	
</template>
<style>
.el-cascader-menu {
  width: 100%;
}
</style>