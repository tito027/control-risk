<template>
  <div class="d-flex">
    <div>
      <div
        :class="`icon icon-shape bg-${color}-soft shadow text-center border-radius-md shadow-none`"
      >
        <i
          :class="`${icon} text-lg text-${color} text-gradient opacity-10`"
          aria-hidden="true"
        ></i>
      </div>
    </div>
    <div :class="this.$store.state.isRTL ? 'me-3' : 'ms-3'">
      <div class="numbers">
        <h6 class="mb-1 text-dark text-sm">{{ title }}</h6>
        <span class="text-sm">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DefaultItem",
  props: {
    color: {
      type: String,
      default: "success",
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
};
</script>
