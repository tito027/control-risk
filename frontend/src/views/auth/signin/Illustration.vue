<script lang="ts" setup>
import Navbar from "@/examples/PageLayout/Navbar.vue"
import ArgonInput from "@/components/ArgonInput.vue"
import ArgonButton from "@/components/ArgonButton.vue"
import { Form } from "vee-validate"
import { onBeforeUnmount, onMounted, ref } from "vue"
import { AppModule } from "@/store/modules/App"
import { schema as loginSchema } from "@/store/schemas/login.schema"
import { AuthModule, ILoginForm } from "@/store/modules/Auth"
import { getUrl } from "@/utils/utils"
const body = document.getElementsByTagName("body")[0]

onMounted(() => {
  AppModule.setHideConfigButton(true)
  AppModule.setLayout(false)
  body.classList.remove("bg-gray-100")
})
onBeforeUnmount(() => {
  AppModule.setHideConfigButton(false)
  AppModule.toggleDefaultLayout()
  body.classList.add("bg-gray-100")
})
function onSubmit(data: ILoginForm) {
  AuthModule.login(data)
}
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
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
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Iniciar sesión</h4>
                  <p class="mb-0 text-primary">
                    Ingrese su carnet y contraseña para iniciar sesión
                  </p>
                </div>
                <div class="card-body">
                  <Form
                    :validation-schema="loginSchema()"
                    @submit="(e: any) => onSubmit(e)"
                    role="form"
                  >
                    <div class="mb-3">
                      <argon-input
                        id="carnet"
                        placeholder="Carnet"
                        name="carnet"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        size="lg"
                      />
                    </div>
                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="primary"
                        type="submit"
                        full-width
                        size="lg"
                        >Iniciar sesión</argon-button
                      >
                    </div>
                  </Form>
                </div>
              </div>
            </div>
            <div
              class="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
            >
              <div
                class="position-relative h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                :style="{
                  backgroundImage:
                    'url(' + getUrl('./assets/img/login.jpg') + ')',
                  backgroundSize: 'cover',
                }"
              >
                <span class="mask bg-gradient-primary opacity-6"></span>

                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  Nuestra doctrina dice:
                </h4>
                <p class="text-white position-relative">
                  No hay misión que no podamos cumplir
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
