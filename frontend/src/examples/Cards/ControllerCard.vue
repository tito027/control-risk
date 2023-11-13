<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="mb-4 d-flex">
        <p class="mb-0">{{ item.state }}</p>
        <div class="form-check form-switch ms-auto">
          <input
            id="flexSwitchCheckHumidity"
            class="form-check-input"
            type="checkbox"
            :checked="item.isChecked"
          />
        </div>
      </div>
      <slot />
      <p class="mb-0 font-weight-bold" :class="item.label.class">
        {{ item.label.text }}
      </p>
      <span class="text-xs"> {{ item.description }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControllerCard",
  props: {
    item: {
      type: Object,
      required: true,
      state: String,
      label: {
        type: Object,
        text: String,
        class: String,
      },
      description: String,
      isChecked: Boolean,
    },
  },
};
</script>
