<template>
  <div class="d-flex align-content-center justify-content-between">
    <el-button class="mt-3 ms-3" @click="showDrawer = true">
      <i class="fas fa-bars me-2"></i>
      Menú
    </el-button>
    <el-drawer v-model="showDrawer" :direction="'ltr'" :size="300">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">Dashboard</h4>
      </template>
      <el-menu class="el-menu-vertical-demo">
        <el-menu-item
          @click="$router.push({ name: 'CheckInOutHistory' })"
          index="1"
        >
          <i class="fas fa-calendar me-2"></i>
          Historial
        </el-menu-item>

        <el-sub-menu index="2">
          <template #title>
            <i class="fas fa-user-tie me-2"></i>
            <span>Agentes</span>
          </template>
          <el-menu-item @click="$router.push({ name: 'Agents' })" index="1-1">
            <i class="fas fa-user-check me-2"></i>
            Lista de agentes
          </el-menu-item>
          <el-menu-item @click="$router.push({ name: 'AgentNew' })" index="1-2">
            <i class="fas fa-user-plus me-2"></i>
            Nuevo agente
          </el-menu-item>
        </el-sub-menu>

        <!--<el-menu-item @click="$router.push({ name: 'Agents' })" index="2">
          <i class="fas fa-user-tie me-2"></i>
          Agentes
        </el-menu-item> -->

        <el-menu-item @click="AuthModule.logout" index="2">
          <i class="fas fa-window-close me-2"></i>
          Cerrar Sesión
        </el-menu-item>
      </el-menu>
    </el-drawer>
    <h1 class="fs-3 me-3 mt-3">Control Risk</h1>
  </div>
</template>

<script lang="ts" setup>
import { AuthModule } from "@/store/modules/Auth"
import { ref } from "vue"

const showDrawer = ref(false)
</script>
