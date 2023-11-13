<template>
  <div class="card h-100">
    <div class="p-3 pb-0 card-header">
      <div class="row">
        <div class="col-md-8 d-flex align-items-center">
          <h6 class="mb-0">{{ title }}</h6>
        </div>
        <div class="col-md-4 text-end">
          <router-link v-if="action.to" :to="action.to">
            <i
              class="text-sm fas fa-user-edit text-secondary"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :title="action.tooltip"
            ></i>
          </router-link>
          <a v-else :to="action.route">
            <i
              class="text-sm fas fa-user-edit text-secondary"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              :title="action.tooltip"
            ></i>
          </a>
        </div>
      </div>
    </div>
    <div class="p-3 card-body">
      <div v-if="descriptionShow">
        <p class="text-sm" :show="false">
          {{ description }}
        </p>
        <hr />
      </div>
      <ul class="fa-ul">
        <li
          v-for="item in contentList"
          class="pt-0 text-sm border-0 list-group-item ps-0"
        >
          <span class="fa-li"><i :class="item.icon"></i></span>
          <strong class="text"> {{ item.tittle }} </strong>
          {{ formatContent(item, info) }}
          <el-tag
            v-if="item.type == Boolean && info[item.name] == true"
            class="ml-2"
            type="success"
            >Sí</el-tag
          >
          <el-tag
            v-if="item.type == Boolean && info[item.name] == false"
            class="ml-2"
            type="danger"
            >No</el-tag
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { string } from "yup"
import { DateTime } from "luxon"
import { formatDate } from "@/utils/utils"
import { ref } from "vue"

const value = ref(true)
const formatContent = (item: any, info: Record<string, any>) => {
  if (item.type == Boolean) return

  let returnInfo: string = ""
  if (!info[item.name]) return " Dato no provisto"
  switch (item.type) {
    case Date:
      returnInfo = formatDate(info[item.name])
      break
    case String:
      returnInfo = info[item.name]
      break
    default:
      break
  }
  return returnInfo
}
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: string,
    required: false,
  },
  descriptionShow: {
    type: Boolean,
    required: false,
    default: false,
  },
  info: {
    type: Object,
    default: {
      name: "Primer Nombre",
      lastname: "Segúndo Apellido",
    },
  },
  action: {
    type: Object,
    route: String,
    to: Object,
    tooltip: String,
    default: () => ({
      route: "javascript:;",
    }),
  },
  contentList: {
    type: [Object],
    default: () => [
      {
        tittle: "Nombres:",
        name: "name",
        type: String,
      },
      {
        tittle: "Apellidos:",
        name: "lastname",
        type: String,
      },
    ],
  },
})
// export default {
//   name: "ProfileInfoCard",
//   props: {

//   },
// };
</script>
