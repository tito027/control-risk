<script lang="ts" setup>
import ApiGateway from '@/store/api';
import ArgonButton from '../ArgonButton.vue';
import { ConfirmModalModule } from '@/store/modules/ConfirmModal';
import { ModalState, Modals } from '@/types/components';
import { ElLoading, ElMessage } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { FormModule } from '@/store/modules/FormModule';

const props = defineProps<{
  show: boolean;
}>()

// emits
const emits = defineEmits<{
  (e: "changeModal", t: { modal: Modals; payload: ModalState }): void
}>();

const dialogFormVisible = ref(props.show);
const loading = computed(() => ConfirmModalModule.getLoading)
let loadingService: ReturnType<typeof ElLoading["service"]>

function confirm() {
  ConfirmModalModule.setLoading(true)
  ApiGateway.put(ConfirmModalModule.getEndpoint).then(response => {
    if(response.data._id) {
      FormModule.setUpdateData()
      ElMessage({
        message: `Se ha deshabilitado la empresa correctamente!!!`,
        type: "success",
      })
      emits('changeModal', {
        modal: 'confirmModal',
        payload: { show: false },
      })
    }
  }).catch(() => {
    ElMessage({
      message: `No se ha podido deshabilitar la empresa!!!`,
      type: "error",
    })
  }).finally(() => {
    ConfirmModalModule.setLoading(false)
  })
}

watch(
  () => props.show,
  () => {
    dialogFormVisible.value = props.show
  }
);

watch(
  () => loading.value,
  loading => {
    if (loading)
      loadingService = ElLoading.service({
        target: `.confirm-modal`,
        lock: true,
        text: 'Cargando...',
        background: "rgba(255, 255, 255, 0.6)",
        customClass: 'modal-loading',
      })
    else !!loadingService && loadingService.close()
  })
</script>
<template>
  <el-dialog
    v-model="dialogFormVisible"
    :title="ConfirmModalModule.getTitle"
    class="confirm-modal"
    width="30%"
    @close="emits('changeModal', {
      modal: 'confirmModal',
      payload: { show: false },
    })"
    align-center
  >
    <template #header>
      <div class="d-flex align-items-center ">
        <div>{{ ConfirmModalModule.getTitle }}</div>
        <i
          :class="`px-3 fa ${ConfirmModalModule.getIcon.icon}`"
          :style="`color: ${ConfirmModalModule.getIcon.iconColor}; font-size: ${ConfirmModalModule.getIcon.iconSize}px;`"
        ></i>
      </div>
    </template>
    <div class="w-100">
      <div class="row m-0">
        <div class="d-flex justify-content-center">{{ ConfirmModalModule.getText }}</div>
      </div>
      <div class="d-flex justify-content-between" style="padding-top: 30px;">
        <argon-button 
          color="light"
          @click="dialogFormVisible = false"
        >
          <span class="text-black">Cancelar</span>
        </argon-button>
        <argon-button
          :color= "ConfirmModalModule.getButtonColor"
          @click="confirm"
        >
          {{ ConfirmModalModule.getButtonText }}
        </argon-button>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="scss">
.modal-loading {
  border-radius: 15px;
}
</style>