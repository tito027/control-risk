<template>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/lock-cover.jpg');
      "
    >
      <h3 class="text-position text-style">El único modo de hacer un gran trabajo es amar lo que haces</h3>
      <span class="mask bg-gradient-dark opacity-6"></span>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-5 col-lg-5 col-md-7 mx-auto">
          <div class="card">
            <div class="card-body text-center">
              <div class="info mb-4 mt-n6">
                <img
                  class="avatar avatar-xxl shadow-lg border border-white"
                  alt="Image placeholder"
                  :src="pictureProfile"
                />
              </div>
              <h4 class="mb-2 font-weight-bolder">{{name}}</h4>
              <p class="mb-4">Debe ingresar contraseña para continuar con el check in</p>
              <form role="form">
                <argon-input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  aria-label="password"
                />
                <div class="text-center">
                  <argon-button
                    type="button"
                    color="dark"
                    variant="gradient"
                    size="lg"
                    class="mt-3 mb-0"
                    >Continuar</argon-button
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import * as axios from "axios";
const body = document.getElementsByTagName("body")[0];
import { mapMutations } from "vuex";
export default {
  name: "LockCover",
  components: {
    Navbar,
    AppFooter,
    ArgonInput,
    ArgonButton,
  },
  data() {
    return {
      name: '',
      pictureProfile: ''
    }
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
  async mounted() {
    await axios.get(`http://localhost:3001/check-in-out/user/SC82573`).then((response) => {
      this.pictureProfile = response.data.picture
      this.name = response.data.name
    })
  },
  methods: {
    ...mapMutations(["toggleDefaultLayout"]),
  },
};
</script>
<style>
.text-position {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1 !important;
}
.text-style {
  color: white;
  font-style: italic;
  text-align: center;
}
</style>