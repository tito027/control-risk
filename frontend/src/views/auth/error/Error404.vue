<template>
  <div class="container position-sticky z-index-sticky top-0">
    <navbar
      :dark-mode="true"
      is-blur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
    />
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header min-vh-100"
      :style="{
        backgroundImage:
          'url(' + require('@/assets/img/illustrations/404.svg') + ')',
      }"
    >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-7 mx-auto text-center">
            <h1 class="display-1 text-bolder text-primary">Error 404</h1>
            <h2>Erm. Page not found</h2>
            <p class="lead">
              We suggest you to go to the homepage while we solve this issue.
            </p>
            <argon-button color="dark" variant="gradient" class="mt-4"
              >Go to Homepage</argon-button
            >
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { mapMutations } from "vuex";
export default {
  name: "SignupBasic",
  components: {
    Navbar,
    AppFooter,
    ArgonButton,
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.toggleDefaultLayout();
    document.getElementsByTagName("body")[0].classList.remove("bg-gray-100")
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.toggleDefaultLayout();
  },
  methods: {
    ...mapMutations(["toggleDefaultLayout"]),
  },
};
</script>
