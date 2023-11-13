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
  <main class="mt-0 main-content">
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
          >
            <div class="card card-plain">
              <div class="pb-0 card-header text-start">
                <h4 class="font-weight-bolder">Reset password</h4>
                <p class="mb-0">
                  You will receive an e-mail in maximum 60 seconds
                </p>
              </div>
              <div class="card-body">
                <form role="form">
                  <div class="mb-3">
                    <argon-input
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      size="lg"
                    />
                  </div>
                  <div class="mb-3">
                    <argon-input
                      id="code"
                      type="text"
                      placeholder="Verification Code"
                      name="code"
                      size="lg"
                    />
                  </div>
                  <div class="text-center">
                    <argon-button
                      class="my-4"
                      variant="gradient"
                      color="success"
                      full-width
                      size="lg"
                      >Send</argon-button
                    >
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative bg-gradient-success h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
              style="
                background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/reset-ill.jpg');
                background-size: cover;
              "
            >
              <span class="mask bg-dark opacity-6"></span>
              <h4 class="mt-5 text-white font-weight-bolder position-relative">
                Argon Design
              </h4>
              <p class="text-white position-relative">
                Just as it takes a company to sustain a product, it takes a
                community to sustain a protocol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import { mapMutations } from "vuex";
const body = document.getElementsByTagName("body")[0];
export default {
  name: "ResetIllustration",
  components: {
    Navbar,
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
