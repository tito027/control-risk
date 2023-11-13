<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar btn-background="bg-gradient-success" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/reset-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-7">Reset Password</h1>
            <p class="text-lead text-white">
              You will receive an e-mail in maximum 60 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card mb-md-8">
            <div class="card-header">
              <div class="d-flex">
                <div
                  class="icon icon-shape bg-success shadow text-center border-radius-md"
                >
                  <i
                    class="ni ni-circle-08 text-white text-lg opacity-10"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="ms-3">
                  <h5 class="mb-0">Can't log in?</h5>
                  <p class="text-sm mb-0">Restore access to your account</p>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form role="form">
                <label>We will send a recovery link to</label>
                <argon-input
                  id="email"
                  type="email"
                  placeholder="Your e-mail"
                  aria-label="Email"
                />
                <div class="text-center">
                  <argon-button color="success" full-width class="w-100 mt-2 mb-0"
                    >Reset password</argon-button
                  >
                  <p class="text-sm mt-3 cursor-pointer mb-0">
                    I don't have access to my Email
                  </p>
                </div>
              </form>
            </div>
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
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
export default {
  name: "ResetCover",
  components: {
    Navbar,
    AppFooter,
    ArgonInput,
    ArgonButton,
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.toggleDefaultLayout();
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.toggleDefaultLayout();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleDefaultLayout"]),
  },
};
</script>
