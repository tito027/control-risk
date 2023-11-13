<template>
  <div class="form-check h-100 d-flex" :class="groupClasses" style="gap: 10px;">
    <input
      :id="id"
      class="form-check-input"
      type="checkbox"
      :name="name"
      :checked="inputValue"
      :disabled="disabled"
      @change="changeValue"
    />
    <label
      :for="id"
      class="custom-control-label fs-7 text-muted"
      :class="$attrs.class"
    >
      {{ label }}
      <slot />
    </label>
  </div>
</template>

<script>
import { useField } from "vee-validate"

export default {
  name: "ArgonCheckbox",
  props: {
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    checked: {
      type: Boolean,
      default: false,
    },
    groupClasses: {
      default: [],
    },
  },
  data() {
    return {
      currentValue: this.checked
    }
  },
  methods: {
    changeValue(value) {
      this.currentValue = value.target.checked
    },
  },
  watch: {
    currentValue(n) {
      this.inputValue = n
    },
    checked(n) {
      this.inputValue = n
      this.currentValue = n
    }
  },
  setup(props) {
    const {
      value: inputValue,
      errorMessage,
      handleChange,
      meta,
    } = useField(props.name, undefined, {
      initialValue: props.checked,
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
