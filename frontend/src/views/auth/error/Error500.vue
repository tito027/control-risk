<template>
  <div class="container position-sticky z-index-sticky top-0">
    <navbar
      btn-background="bg-gradient-warning"
      :dark-mode="true"
      is-blur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
    />
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header min-vh-100"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/error-500.jpg');
      "
    >
      <span class="mask bg-gradient-warning opacity-4"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-7 mx-auto text-center">
            <h1
              class="display-1 text-bolder text-white fadeIn1 fadeInBottom mt-5"
            >
              Error 500
            </h1>
            <h2 class="fadeIn3 fadeInBottom mt-3 text-white">
              Something went wrong
            </h2>
            <p class="lead fadeIn2 fadeInBottom text-white">
              We suggest you to go to the homepage while we solve this issue.
            </p>
            <argon-button
              color="warning"
              variant="gradient"
              class="mt-4 fadeIn2 fadeInBottom"
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
