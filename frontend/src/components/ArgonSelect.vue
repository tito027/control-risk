<script lang="ts" setup>
import axios from "axios";
import { useField } from "vee-validate"
import { onMounted, ref, watch } from "vue"
import Choices from "choices.js"
import { SelectContext } from "element-plus"
import { ArgonOptions as Options } from "@/types/components"
import { env } from "@/config";
export type SelectProps = {
  label: string;
  smallLabel?: boolean;
  required?: boolean;
  size?: "default";
  success?: false;
  error?: false;
  icon?: string;
  iconDir?: string;
  name: string;
  id: string;
  value?: string;
  placeholder?: string;
  isRequired?: boolean;
  search?: false;
  noResultText?: string;
  noChoicesText?: string;
  options?: any;
  fetch?: string;
	remote?: string;
	query_param?: string;
  params?: { [k: string]: string | number };
  selectOptions: Pick<SelectContext, "props">["props"] & {
		size?: "large" | "default" | "small";
		valueKey: string;
		returnAll?: boolean;
		labelKey: string;
		noDataText?: string;
		multiple: boolean;
	};
}
// Props
const props = defineProps<SelectProps>()

// State data
const model = ref<string>()
const choices = ref<Choices | undefined>()
const options = ref<Options[]>([]);
const loading = ref(false);

// hooks
const {
  value: inputValue,
  errorMessage,
  handleChange,
} = useField(props.name, undefined, {
  initialValue: props.value,
})

// Methods
const getOptions = (query = "", value?: any) => {
	loading.value = true;
	if ((!props.remote || !props.query_param) && props.fetch) {
		axios
			.get<{ data: any[] }>(`${env.apiGateway}${props.fetch}`)
			.then(res => {
				options.value = res.data.data.map(item => ({
					value: item,
					label: item[props.selectOptions.labelKey ?? "label"],
				}));
			})
			.finally(() => {
				loading.value = false;
				if (value) model.value = value;
			});
		return;
	} else if (props.remote && props.query_param)
		axios
			.get<any[]>(props.remote, {
				params: {
					[props.query_param]: query,
					...props.params,
				},
			})
			.then(res => {
				options.value = res.data.map(item => ({
					value: item[props.selectOptions.labelKey ?? "valueKey"],
          item,
					label: item[props.selectOptions.labelKey ?? "label"],
				}));
			})
			.finally(() => (loading.value = false));
	else if (props.options) {
		if (value !== undefined) model.value = value;
		options.value = props.options;
		loading.value = false;
	}
};
const fetchIndividual = (value: string | number) => {
	if (!props.remote || !props.query_param) return;
	loading.value = true;
	axios
		.get<any[]>(props.remote, {
			params: {
				[props.query_param]: value,
			},
		})
		.then(res => {
			options.value = res.data.map(item => ({
				value: item,
				label: item[props.selectOptions.labelKey ?? "label"],
			}));
		})
		.finally(() => {
			loading.value = false;
			model.value = options.value[0].value;
			change(model.value);
		});
};

function getChoices(id: string) {
  if (document.getElementById(id)) {
    var element = document.getElementById(id) as HTMLInputElement
    if (element)
      return new Choices(element, {
        searchEnabled: props.search,
        itemSelectText: "",
        noResultsText: props.noResultText ?? "Datos no encontrados",
        noChoicesText:
          props.noChoicesText ?? "No ha seleccionado ninguna opción",
        sorter: (a, b) => {
          return (b.placeholder ? 1 : 0) - (a.placeholder ? 1 : 0)
        },
      })
    return
  }
}

function getClasses(size: string, success?: boolean, error?: boolean) {
  let sizeValue, isValidValue

  sizeValue = size ? `form-control-${size}` : ""

  if (error) {
    isValidValue = "is-invalid"
  } else if (success) {
    isValidValue = "is-valid"
  } else {
    isValidValue = ""
  }

  return `${sizeValue} ${isValidValue}`
}
const getIcon = (icon: string) => (icon ? icon : null)
const hasIcon = (icon: string) => (icon ? "input-group" : null)
const change = (a: any) => {
  if (a.target.value)
    return Array.isArray(a.target.value)
      ? handleChange(a.target.value.join(","))
      : handleChange(a.target.value)
}

watch(
  () => options.value,
  () => {
    if(props.placeholder)
      options.value.push({
        value: props.placeholder,
        label: props.placeholder,
        placeholder: true,
        disabled: true,
        selected: true,
      }) 
    if(choices.value)
      choices.value?.setChoices(options.value)
  }
)

watch(
	() => props.value,
	() => {
		model.value = props.value
	}
)

onMounted(() => {
  choices.value = getChoices(props.id)
  if (
		(typeof props.value === "string" || typeof props.value === "number") &&
		props.remote
	)
		fetchIndividual(props.value);
	else getOptions("", props.value);
})
</script>
<template>
  <div class="form-group form-group-select">
    <slot name="label">
			<label v-if="label">
				<small v-if="smallLabel" :class="!errorMessage ? 'text-muted' : 'text-danger'">{{ label }}</small>
				<template v-else> {{ label }}</template>
				<span v-if="required">*</span>
			</label>
		</slot>
    <div :class="hasIcon(icon ?? '')">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon ?? '')"></i>
      </span>
      <input type="hidden" name="fake" id="fake" :value="inputValue" />
      <select
        :id="id"
        class="form-control"
        :class="getClasses(size ?? '', success, !!errorMessage)"
        :name="name"
        :value="model"
        :isRequired="isRequired"
        @change="change"
      >
        <slot />
      </select>
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon ?? '')"></i>
      </span>
    </div>
    <slot name="helpBlock">
      <small
        class="text-danger invalid-feedback"
        style="display: block"
        :class="{ 'mt-2': hasIcon }"
        v-show="errorMessage"
      >
        {{ errorMessage }}
      </small>
    </slot>
  </div>
</template>
<style>
.form-group-select {
  width: 100% !important;
}
</style>
