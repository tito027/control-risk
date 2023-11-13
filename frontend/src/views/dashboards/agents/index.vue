<template>
  <div class="p-2 mt-5">

    <!-- Agentes -->
    <div class="d-flex justify-content-between mx-sm-7 mx-3">
      <h1 class="fs-2">Agentes</h1>
      <el-button class="ms-3" @click="clearFilters">
        Limpiar filtros
      </el-button>
    </div>

    <div class="mx-sm-7 mx-3 mt-3">
      <div class="d-flex flex-wrap justify-content-between my-4">
        <div>
          <el-select
            v-model="agentStatus"
            placeholder="Seleccionar estado"
            size="large"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div>
          <el-input
            v-model="filterText"
            placeholder="Buscar por carnet"
            class="input-with-select"
            size="large"
          >
            <template #append>
              <el-button>
                <i class="fas fa-search"></i>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      <br />
      <el-skeleton :loading="AgentsModule.isLoading" :rows="15" animated />
      <el-table
        :data="AgentsModule.Agents"
        stripe
        style="width: 100%; height: 650px; overflow: auto"
      >
        <el-table-column
          prop="carnet"
          label="Carnet"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="nombre"
          label="Nombre"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="agencia"
          label="Agencia"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="Estado" min-width="180" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.active === true ? 'success' : 'danger'">
              {{ scope.row.active === true ? "Activo" : "Inactivo" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Acciones" min-width="280" align="center">
          <template #default="scope">
            <!-- si active es false y existe la propiedad nextStep mostramos botón para continuar el registro -->
            <el-button
              type="info"
              size="small"
              @click="goOverview(scope.row.carnet)"
            >
              Ver registro
            </el-button>
            <el-button
              v-if="scope.row.active === false && scope.row.nextStep"
              type="primary"
              size="small"
              @click="goToNextStep(scope.row)"
            >
              Continuar registro
            </el-button>
            <el-button size="small" type="danger">
              <a
                :href="getUrl(`./backend/agents/carnet/${scope.row.carnet}`)"
                target="_blank"
                style="color: white; text-decoration: none"
              >
                Imprimir
              </a>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- Agregamos paginación a la tabla -->
      <div class="d-flex justify-content-end">
        <el-pagination
          v-model:currentPage="currentPage"
          layout="prev, pager, next"
          :total="AgentsModule.TotalRegisters"
          :page-size="15"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AgentsModule } from "@/store/modules/Agents"
import DashboardMenu from "@/components/dashboard/DashboardMenu.vue"
import { getUrl } from "@/utils/utils"
import { ref, watch } from "vue"
import { useRouter} from "vue-router"

const router = useRouter()
const currentPage = ref(1)
const filterText = ref("")

const agentStatus = ref("")

const options = [
  {
    value: "Activos",
    label: "Activos",
  },
  {
    value: "Inactivos",
    label: "Inactivos",
  },
]

// Llamamos EndPoint
AgentsModule.getAgents({
  pag: 1,
})

// watch que mira currentPage1 para obtener los datos de la tabla
watch(currentPage, val => {
  AgentsModule.getAgents({
    pag: val,
  })
})

// watch que mira filterText para obtener los datos de la tabla
watch(filterText, val => {
  AgentsModule.getAgents({
    pag: 1,
    carnet: val,
  })
})

// watch que mira agentStatus para obtener los datos de la tabla
watch(agentStatus, val => {
  AgentsModule.getAgents({
    pag: 1,
    activo: val,
  })
})

function clearFilters() {
  // limpiamos los filtros
  filterText.value = ""
  agentStatus.value = ""
}

function goToNextStep(row: any) {
  console.log(row)
  // Nos dirigimos a AgenstCreate y le pasamos como queryparameters los ids y el paso al que sigue
  window.location.href = `/admin/agents/create?uI=${row.userid}&uII=${row.userinfoid}&nextStep=${row.nextStep}`
}
function goOverview(carnet: string) {
  console.log(carnet)
  // Nos dirigimos a AgenstCreate y le pasamos como queryparameters los ids y el paso al que sigue
  window.location.href = `/admin/agents/overview?carnet=${carnet}`
}
</script>

<style scoped></style>
