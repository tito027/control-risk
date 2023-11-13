<template>
  <a
    :data-bs-toggle="collapse ? 'collapse' : ''"
    :href="collapse ? `#${collapseRef}` : collapseRef"
    :aria-controls="collapseRef"
    :aria-expanded="isExpanded"
    class="nav-link"
    v-bind="$attrs"
    @click="isExpanded = !isExpanded"
  >
    <div
      class="icon icon-shape icon-sm text-center d-flex align-items-center justify-content-center"
    >
      <slot name="icon"></slot>
    </div>
    <span
      class="nav-link-text"
      :class="this.$store.state.isRTL ? ' me-1' : 'ms-1'"
      >{{ navText }}</span
    >
  </a>
  <div :class="isExpanded ? 'collapse show' : 'collapse'">
    <slot name="list"></slot>
  </div>
</template>
<script>
export default {
  name: "SidenavCollapse",
  props: {
    collapseRef: {
      type: String,
      required: true
    },
    navText: {
      type: String,
      required: true
    },
    collapse: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isExpanded: false
    };
  }
};
</script>
