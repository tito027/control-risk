<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-warning"
          :dark-mode="true"
        />
      </div>
    </div>
  </div>
  <main class="main-content main-content-bg mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/verification-cover.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-7">Good evening!</h1>
            <p class="text-lead text-white">
              Use these awesome forms to login or create new account in your
              project for free.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card mb-5">
            <div class="card-body px-lg-5 py-lg-5 text-center">
              <div class="text-center text-muted mb-4">
                <h2>2-Step Verification</h2>
              </div>
              <div class="row gx-2 gx-sm-3">
                <div class="col">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      maxlength="1"
                      autocomplete="off"
                      autocapitalize="off"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      maxlength="1"
                      autocomplete="off"
                      autocapitalize="off"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      maxlength="1"
                      autocomplete="off"
                      autocapitalize="off"
                    />
                  </div>
                </div>
                <div class="col">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      maxlength="1"
                      autocomplete="off"
                      autocapitalize="off"
                    />
                  </div>
                </div>
              </div>
              <div class="text-center">
                <argon-button type="button" class="btn bg-gradient-warning w-100 mb-3"
                  >Send code</argon-button
                >
                <span class="text-muted text-sm">
                  Haven't received it?
                  <router-link :to="{ name: 'Reset Cover' }">
                    Resend a new code.
                  </router-link>
                </span>
              </div>
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
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
export default {
  name: "VerificationCover",
  components: {
    Navbar,
    ArgonButton,
    AppFooter,
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
