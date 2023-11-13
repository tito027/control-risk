<template>
  <div class="card">
    <div class="card-body">
      <div
        class="text-center shadow icon icon-shape"
        :class="`bg-gradient-${icon.background}`"
      >
        <i :class="`opacity-10 ${icon.component}`" aria-hidden="true"></i>
      </div>
      <!--  eslint-disable-next-line vue/no-v-html -->
      <h5 class="mt-3 mb-0" v-html="title"></h5>
      <p class="mb-0">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MiniInfoCard",
  props: {
    icon: {
      type: Object,
      required: true,
      component: String,
      background: String,
      default: () => ({
        component: "ni ni-curved-next",
        background: "success",
      }),
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
};
</script>
