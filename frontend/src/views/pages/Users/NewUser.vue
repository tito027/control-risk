<script lang="ts" setup>
import ControlPopup from "@/components/ControlPopup.vue"
import { onMounted, computed } from "vue"
import UserInfo from "./components/UserInfo.vue"
import Profile from "./components/Profile.vue"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { AlertState } from "@/plugins/error"
import { AgentsModule } from "@/store/modules/Agents"
import PhysicalDescription from "@/views/pages/Users/components/PhysicalDescription.vue"
import AcademicTraining from "@/views/pages/Users/components/AcademicTraining.vue"
import TechnicalSkills from "@/views/pages/Users/components/TechnicalSkills.vue"
import WorkHistory from "@/views/pages/Users/components/WorkHistory.vue"
import FamilyPersonalReferences from "@/views/pages/Users/components/FamilyPersonalReferences.vue"
import FamilyRelationship from "@/views/pages/Users/components/FamilyRelationship.vue"
import SpouseData from "@/views/pages/Users/components/SpouseData.vue"

const showMenu = ref(false)
const activeClass = ref("js-active position-relative")
const activeStep = ref(0)
const formSteps = ref(8)
const showModalSuccess = ref(false)
const showModalError = ref(false)

const agent = computed(() => AgentsModule.getAgentOverview)

function nextStep() {
  if (activeStep.value < formSteps.value) {
    activeStep.value += 1
    if (activeStep.value === 8) showModalSuccess.value = true
  } else {
    activeStep.value -= 1
  }
}
function prevStep() {
  if (activeStep.value > 0) {
    activeStep.value -= 1
  }
}

const route = useRoute()
const router = useRouter()
onMounted(() => {
  const { s: step } = route.query
  if (step) activeStep.value = parseInt(step.toString()) - 1

  // si en la url no vienen edit o edit no es true bloqueamos los botones de los steps
  const { edit } = route.query
  if (!edit || edit !== "true") {
    // obtenemos todos los botones con la clase stepButtonsEnabled
    const stepButtonsEnabled = document.querySelectorAll(".stepButtonsEnabled")
    // recorremos los botones y los desabilitamos
    stepButtonsEnabled.forEach(button => {
      button.setAttribute("disabled", "disabled")
    })
  }
})
const accept = {
  text: "Continuar",
  action() {
    showModalSuccess.value = false
    router.replace({ query: { ...route.query, s: 8 } })
    nextStep()
  },
}
const cancel = {
  text: "Volver al listado",
  action: () => router.push({ name: "Agents" }),
}
</script>
<template>
  <div class="container-fluid py-5">
    <control-popup
      v-model="showModalSuccess"
      :type="AlertState.success"
      title="Registro Completado"
      text="¿Desea regresar al listado de agentes o continuar con el paso de subida de archivos?"
      :accept="accept"
      :cancel="cancel"
    />
    <el-dialog v-model="showModalError" :close-on-click-modal="false">
      <div class="text-center">
        <h2>Ocurrio un error</h2>
        <p>
          Ha ocurrido un error a la hora de registrar este paso, favor volver a
          intentar
        </p>
        <el-button @click="showModalError = false">Finalizar</el-button>
      </div>
    </el-dialog>
    <div class="row">
      <div class="col-12">
        <div class="multisteps-form">
          <div class="row">
            <div class="col-12 col-lg-10 mx-auto mb-4">
              <div class="card">
                <div class="card-header m-0 py-0 px-1 d-flex">
                  <router-link
                    :to="{ name: 'Agents' }"
                    class="btn btn-white btn-sm border-0 m-0"
                  >
                    <i class="fas fa-long-arrow-alt-left"></i>
                    Regresar a listado
                    {{ agent?.carnet }}
                  </router-link>
                  <router-link
                    v-if="route.query.edit === 'true' && agent?.carnet"
                    :to="{
                      name: 'AgentOverview',
                      query: { carnet: agent?.carnet },
                    }"
                    class="btn btn-white btn-sm ms-auto border-0 m-0"
                  >
                    <i class="fas fa-eye"></i>
                    Ver perfil
                  </router-link>
                </div>
                <div class="card-body">
                  <div class="multisteps-form__progress">
                    <button
                      class="multisteps-form__progress-btn js-active stepButtonsEnabled"
                      type="button"
                      title="Datos generales"
                      :class="activeStep >= 0 ? activeClass : ''"
                      @click="activeStep = 0"
                    >
                      <small>Datos generales</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Descripción física"
                      :class="activeStep >= 1 ? activeClass : ''"
                      @click="activeStep = 1"
                    >
                      <small>Descripción física</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Formación académica"
                      :class="activeStep >= 2 ? activeClass : ''"
                      @click="activeStep = 2"
                    >
                      <small>Formación académica</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Habilidades técnicas"
                      :class="activeStep >= 3 ? activeClass : ''"
                      @click="activeStep = 3"
                    >
                      <small>Habilidades técnicas</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Experiencias laborales"
                      :class="activeStep >= 4 ? activeClass : ''"
                      @click="activeStep = 4"
                    >
                      <small>Experiencias laborales</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Referencias"
                      :class="activeStep >= 5 ? activeClass : ''"
                      @click="activeStep = 5"
                    >
                      <small>Referencias</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Relación familiar"
                      :class="activeStep >= 6 ? activeClass : ''"
                      @click="activeStep = 6"
                    >
                      <small>Relación familiar</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Datos del cónyugue"
                      :class="activeStep >= 7 ? activeClass : ''"
                      @click="activeStep = 7"
                    >
                      <small>Datos del cónyugue</small>
                    </button>
                    <button
                      class="multisteps-form__progress-btn stepButtonsEnabled"
                      type="button"
                      title="Documentación"
                      :class="activeStep >= 8 ? activeClass : ''"
                      @click="activeStep = 8"
                    >
                      <small>Documentación</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--form panels-->
          <div class="row">
            <div class="col-12 col-lg-10 m-auto">
              <form class="multisteps-form__form">
                <!--single form panel-->
                <user-info
                  v-if="activeStep === 0"
                  :class="activeStep === 0 ? activeClass : ''"
                  @next="nextStep"
                />
                <!--single form panel-->
                <physical-description
                  v-if="activeStep === 1"
                  :class="activeStep === 1 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <academic-training
                  v-if="activeStep === 2"
                  :class="activeStep === 2 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <technical-skills
                  v-if="activeStep === 3"
                  :class="activeStep === 3 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <work-history
                  v-if="activeStep === 4"
                  :class="activeStep === 4 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <family-personal-references
                  v-if="activeStep === 5"
                  :class="activeStep === 5 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <family-relationship
                  v-if="activeStep === 6"
                  :class="activeStep === 6 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <spouse-data
                  v-if="activeStep === 7"
                  :class="activeStep === 7 ? activeClass : ''"
                  @prev="prevStep"
                  @next="nextStep"
                />
                <!--single form panel-->
                <profile :class="activeStep === 8 ? activeClass : ''" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
