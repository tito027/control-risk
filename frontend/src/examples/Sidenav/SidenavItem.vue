<template>
  <li class="nav-item" v-if="isAuthenticated">
    <router-link class="nav-link" :to="to">
      <span class="sidenav-mini-icon"> {{ miniIcon }} </span>
      <span class="sidenav-normal"> {{ text }} </span>
    </router-link>
  </li>
</template>
<script>
export default {
  name: "SidenavItem",
  props: {
    to: {
      type: [Object, String],
      required: true,
    },
    miniIcon: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    guard: {
      type: Array,
      default: () => [GuardRoles.ANY],
      validator: value => {
        return value.every(item => Object.values(GuardRoles).includes(item))
      },
    },
  },
  computed: {
    isAuthenticated() {
      // Comprobar si el usuario tiene uno de los roles permitidos
      return (
        this.guard.includes(AuthModule.role) ||
        this.guard.includes(GuardRoles.ANY)
      )
    },
  },
}

import { AuthModule } from "@/store/modules/Auth"
import { GuardRoles } from "@/types/router"
</script>
