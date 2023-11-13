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
    <textarea
      :id="id"
      class="form-control"
      :rows="rows"
      :placeholder="placeholder"
      v-model="inputValue"
    ></textarea>
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
  name: "ArgonTextarea",
  props: {
    id: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    rows: {
      type: Number,
      default: 1,
    },
    success: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Boolean,
      default: false,
    },
    smallLabel: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },

    isRequired: {
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
