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
      class="page-header align-items-start min-vh-50 pt-7 pb-9"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-cover.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
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
          <div class="card mt-5">
            <div class="card-header pb-0 text-start">
              <h3 class="font-weight-bolder">Welcome back</h3>
              <p class="mb-0">Enter your email and password to sign in</p>
            </div>
            <div class="card-body">
              <form role="form" class="text-start">
                <label>Email</label>
                <argon-input
                  id="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                />
                <label>Password</label>
                <argon-input
                  id="password"
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                />
                <argon-switch id="rememberMe" name="rememberMe">
                  Remember me
                </argon-switch>
                <div class="text-center">
                  <argon-button color="success" full-width class="mt-4 mb-0"
                    >Sign in</argon-button
                  >
                </div>
              </form>
            </div>
            <div class="card-footer text-center pt-0 px-lg-2 px-1">
              <p class="mb-4 text-sm mx-auto">
                Don't have an account?
                <router-link
                  :to="{ name: 'Signup Cover' }"
                  class="text-success font-weight-bold"
                  >Sign up</router-link
                >
              </p>
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
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";

export default {
  name: "SigninCover",
  components: {
    Navbar,
    AppFooter,
    ArgonInput,
    ArgonSwitch,
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
