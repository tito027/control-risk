<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-dark"
          :dark-mode="true"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="text-center card-body px-lg-5 py-lg-5">
                  <div class="mb-4 text-center text-muted">
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
                    <argon-button class="mt-0 mb-3" color="warning" full-width
                      >Send code</argon-button
                    >
                    <span class="text-sm text-muted">
                      Haven't received it?
                      <router-link :to="{ name: 'Reset Illustration' }">
                        Resend a new code.
                      </router-link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
            >
              <div
                class="position-relative bg-warning h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/verification-ill.jpg');
                  background-size: cover;
                "
              >
                <span class="mask bg-warning opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
export default {
  name: "VerificationIllustration",
  components: {
    Navbar,
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
