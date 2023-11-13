<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        />
      </div>
    </div>
  </div>

  <main class="main-content main-content-bg mt-0">
    <div
      class="page-header min-vh-100"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/reset-basic.jpg');
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-4 col-md-7">
            <div class="card z-index-0 mb-7">
              <div class="card-header text-center pt-4 pb-1">
                <h4 class="font-weight-bolder mb-1">Reset password</h4>
                <p class="mb-0">
                  You will receive an e-mail in maximum 60 seconds
                </p>
              </div>
              <div class="card-body">
                <form role="form">
                  <argon-input
                    id="email"
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                  />
                  <div class="text-center">
                    <argon-button
                      color="dark"
                      variant="gradient"
                      class="my-4 mb-2"
                      full-width
                      >Send</argon-button
                    >
                  </div>
                </form>
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
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";

export default {
  name: "ResetBasic",
  components: {
    Navbar,
    AppFooter,
    ArgonInput,
    ArgonButton,
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.toggleDefaultLayout();
    body.classList.remove("bg-gray-200");
  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.toggleDefaultLayout();
    body.classList.add("bg-gray-200");
  },
  methods: {
    ...mapMutations(["toggleDefaultLayout"]),
  },
};
</script>
