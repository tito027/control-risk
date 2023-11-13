<template>
  <div class="form-group" :class="$attrs.class">
    <slot name="label">
      <label
        v-if="label"
        :class="{
          'fs-7': smallLabel,
          'text-danger': errorMessage,
          'text-muted': !errorMessage,
        }"
      >
        {{ label }}
        <span v-if="isRequired">*</span>
      </label>
    </slot>
    <div
      :class="[
        {
          'input-group': icon,
          'has-label': label || $slots.label,
        },
      ]"
    >
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <input
        v-if="type === 'number'"
        :id="id"
        type="number"
        class="form-control"
        :class="getClasses(size, success, !!errorMessage)"
        :name="name"
        :value="inputValue"
        :placeholder="placeholder"
        :isRequired="isRequired"
        :step="step"
        :min="min"
        :max="max"
        @input="handleChange"
      />
      <input
        v-else
        :id="id"
        :type="type"
        class="form-control"
        :class="getClasses(size, success, !!errorMessage)"
        :name="name"
        :value="inputValue"
        :placeholder="placeholder"
        :isRequired="isRequired"
        :disabled="disabled"
        @input="handleChange"
      />
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
    </div>
    <div
      class="text-danger invalid-feedback"
      style="display: block"
      v-show="errorMessage"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { useField } from "vee-validate"

export default {
  name: "ArgonInput",
  props: {
    size: {
      type: String,
      default: "default",
    },
    success: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    iconDir: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    smallLabel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: -9999999999,
    },
    max: {
      type: Number,
      default: 9999999999,
    },
  },
  methods: {
    getClasses: (size, success, error) => {
      let sizeValue, isValidValue

      sizeValue = size ? `form-control-${size}` : null

      if (error) {
        isValidValue = "is-invalid"
      } else if (success) {
        isValidValue = "is-valid"
      } else {
        isValidValue = ""
      }

      return `${sizeValue} ${isValidValue}`
    },
    getIcon: icon => (icon ? icon : null),
    hasIcon: icon => (icon ? "input-group" : null),
  },
  watch: {
    value(n) {
      this.inputValue = n
    },
  },
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleChange,
      meta,
    } = useField(props.name, undefined, {
      initialValue: props.value,
    })

    return {
      handleChange,
      errorMessage,
      inputValue,
      meta,
    }
  },
}
</script>

<style>
label {
  font-size: 15px;
  margin: 0 !important;
}
</style>
