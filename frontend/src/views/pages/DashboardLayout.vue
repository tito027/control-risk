<script lang="ts" setup>
import { ModalState, Modals } from "@/types/components"
import CreateMassiveGratificationModal from "@/components/modals/CreateMassiveGratificationModal.vue"
import { reactive, defineAsyncComponent, onMounted } from "vue"
import { AppModule } from "@/store/modules/App"
const CreateBusinessContactsModal = defineAsyncComponent(
  () => import("@/components/modals/CreateBusinessContactsModal.vue")
)
const businessConfigModal = defineAsyncComponent(
  () => import("@/components/modals/BusinessConfigModal.vue")
)
const confirmModal = defineAsyncComponent(
  () => import("@/components/modals/ConfirmModal.vue")
)
const agencyModal = defineAsyncComponent(
  () => import("@/components/modals/AgencyModal.vue")
)
const agencyConfigModal = defineAsyncComponent(
  () => import("@/components/modals/AgencyConfigModal.vue")
)
const physicalPositionModal = defineAsyncComponent(
  () => import("@/components/modals/PhysicalPositionModal.vue")
)
const userAssignmentModal = defineAsyncComponent(
  () => import("@/components/modals/UserAssignment.vue")
)
const CreateWorkshiftModal = defineAsyncComponent(
  () => import("@/components/modals/CreateWorkshiftModal.vue")
)
const AssignUserWorkshiftModal = defineAsyncComponent(
  () => import("@/components/modals/AssignUserWorkshiftModal.vue")
)
const UnassignUserWorkshiftModal = defineAsyncComponent(
  () => import("@/components/modals/UnassignUserWorkshiftModal.vue")
)
const CreateMassiveDiscountModal = defineAsyncComponent(
  () => import("@/components/modals/CreateMassiveDiscountModal.vue")
)
const BusinessModal = defineAsyncComponent(
  () => import("@/components/modals/BusinessModal.vue")
)
const CreatePayrollModal = defineAsyncComponent(
  () => import("@/components/modals/CreatePayrollModal.vue")
)
const CreateHolidayModal = defineAsyncComponent(
  () => import("@/components/modals/CreateHolidayModal.vue")
)
const CreateGratificationTypeModal = defineAsyncComponent(
  () => import("@/components/modals/CreateGratificationTypeModal.vue")
)
const CreateDiscountTypeModal = defineAsyncComponent(
  () => import("@/components/modals/CreateDiscountTypeModal.vue")
)
const CreateDiscountModal = defineAsyncComponent(
  () => import("@/components/modals/CreateDiscountModal.vue")
)

const CreateUnknownModal = defineAsyncComponent(
  () => import("@/components/modals/CreateUnknownModal.vue")
)

const CreateGratificationModal = defineAsyncComponent(
  () => import("@/components/modals/CreateGratificationModal.vue")
)
const CreateScheduledGratificationModal = defineAsyncComponent(
  () => import("@/components/modals/CreateScheduledGratificationModal.vue")
)
const CreateScheduledDiscountModal = defineAsyncComponent(
  () => import("@/components/modals/CreateScheduledDiscountModal.vue")
)
const ClosePayrollModal = defineAsyncComponent(
  () => import("@/components/modals/ClosePayrollModal.vue")
)
const CloseHolidayModal = defineAsyncComponent(
  () => import("@/components/modals/CloseHolidayModal.vue")
)
const ApproveHolidayModal = defineAsyncComponent(
  () => import("@/components/modals/ApproveHolidayModal.vue")
)
const RemoveUserModal = defineAsyncComponent(
  () => import("@/components/modals/RemoveUserInventory.vue")
)
const CreateInventoryModal = defineAsyncComponent(
  () => import("@/components/modals/CreateInventoryModal.vue")
)
const UpdateInventoryModal = defineAsyncComponent(
  () => import("@/components/modals/UpdateInventoryModal.vue")
)
const CheckedNewsModal = defineAsyncComponent(
  () => import("@/components/modals/CheckedNewsModal.vue")
)
const CreateComplaintModal = defineAsyncComponent(
  () => import("@/components/modals/CreateComplaintModal.vue")
)
const CreateNewsModal = defineAsyncComponent(
  () => import("@/components/modals/CreateNewsModal.vue")
)
const PsychoModal = defineAsyncComponent(
  () => import("@/components/modals/PsychoModal.vue")
)
const agentStatusModal = defineAsyncComponent(
  () => import("@/components/modals/AgentStatusModal.vue")
)
const weaponMaintenanceModal = defineAsyncComponent(
  () => import("@/components/modals/WeaponMaintenanceModal.vue")
)

const state = reactive<{
  [k: string]: ModalState
}>({
  formBusinessModal: { show: false },
  formBusinessContactModal: { show: false, isEdit: false, payload: {} },
  formCreatePayrollModal: { show: false },
  formCreateGratificationTypeModal: { show: false, isEdit: false, payload: {} },
  formCreateDiscountTypeModal: { show: false, isEdit: false, payload: {} },
  formCreateMasiveDiscountModal: { show: false },
  formCreateMasiveGratificationModal: { show: false },
  formCreateUnknownModal: { show: false },
  formAssignDiscountModal: { show: false },
  formCreateDiscountModal: { show: false },
  formCreateScheduledDiscountModal: { show: false, isEdit: false, payload: {} },
  formAssignGratificationModal: { show: false },
  formCreateScheduledGratificationModal: {
    show: false,
    isEdit: false,
    payload: {},
  },
  formPsychoModal: { show: false },
  formClosePayrollModal: { show: false },
  formAgentStatusModal: { show: false },
  formCreateWorkshiftAgentModal: { show: false, isEdit: false, payload: {} },
  formAssignWorkshiftAgentModal: { show: false, isEdit: false, payload: {} },
  formUnassignWorkshiftAgentModal: { show: false, isEdit: false, payload: {} },
  formHolidayModal: { show: false, isEdit: false, payload: {} },
  formNewsModal: { show: false, isEdit: false, payload: {} },
  formInventoryModal: { show: false, isEdit: false, payload: {} },
  formUpdateInventoryModal: { show: false, isEdit: false, payload: {} },
  formWeaponMaintenanceModal: { show: false, isEdit: false, payload: {} },
  formComplaintModal: { show: false, isEdit: false, payload: {} },
  formCloseHolidayModal: { show: false, payload: {} },
  formApproveHolidayModal: { show: false, payload: {} },
  formRemoveUserModal: { show: false, payload: {} },
  formCheckedNewsModal: { show: false, payload: {} },
  formBusinessConfigModal: {
    show: false,
  },
  confirmModal: {
    show: false,
  },
  formAgencyModal: {
    show: false,
  },
  formAgencyConfigModal: {
    show: false,
  },
  formPhysicalPositionModal: {
    show: false,
  },
  formAgentAssignmentModal: {
    show: false,
  },
})

onMounted(() => {
  /*   window.addEventListener("resize", value => {
    const width = document.documentElement.clientWidth
    if (width < 1200) {
      AppModule.navbarMinimize()
    }
  }) */
  if (document.documentElement.clientWidth < 1200) AppModule.minimize()
  window.addEventListener("resize", value => {
    const width = document.documentElement.clientWidth
    if (width < 1200) {
      AppModule.minimize()
    } else AppModule.maximize()
  })
})
// funcitons
function changeModal(payload: ModalState, modal: Modals) {
  state[modal].show = payload.show
  state[modal].isEdit = payload.isEdit
  state[modal].payload = payload.payload
}
</script>
<template>
  <router-view @change-modal="(p: any) => changeModal(p.payload, p.modal)" />
  <business-modal
    v-if="state.formBusinessModal.show"
    :show="state.formBusinessModal.show"
    @change-modal="(p: any) => changeModal(p, 'formBusinessModal')"
  />
  <create-payroll-modal
    v-if="state.formCreatePayrollModal.show"
    :show="state.formCreatePayrollModal.show"
    @close="state.formCreatePayrollModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreatePayrollModal')"
  />
  <create-gratification-type-modal
    v-if="state.formCreateGratificationTypeModal.show"
    :state="state.formCreateGratificationTypeModal"
    @close="state.formCreateGratificationTypeModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateGratificationTypeModal')"
  />
  <create-discount-type-modal
    v-if="state.formCreateDiscountTypeModal.show"
    :state="state.formCreateDiscountTypeModal"
    @close="state.formCreateDiscountTypeModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateDiscountTypeModal')"
  />
  <create-discount-modal
    v-if="state.formAssignDiscountModal.show"
    :show="state.formAssignDiscountModal.show"
    @close="state.formAssignDiscountModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formAssignDiscountModal')"
  />
  <create-massive-discount-modal
    v-if="state.formCreateMasiveDiscountModal.show"
    :show="state.formCreateMasiveDiscountModal.show"
    @close="state.formCreateMasiveDiscountModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateMasiveDiscountModal')"
  />
  <create-massive-gratification-modal
    v-if="state.formCreateMasiveGratificationModal.show"
    :show="state.formCreateMasiveGratificationModal.show"
    @close="state.formCreateMasiveGratificationModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateMasiveGratificationModal')"
  />
  <create-unknown-modal
    v-if="state.formCreateUnknownModal.show"
    :show="state.formCreateUnknownModal.show"
    @close="state.formCreateUnknownModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateUnknownModal')"
  />
  <create-scheduled-discount-modal
    v-if="state.formCreateScheduledDiscountModal.show"
    :state="state.formCreateScheduledDiscountModal"
    @close="state.formCreateScheduledDiscountModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateScheduledDiscountModal')"
  />
  <create-gratification-modal
    v-if="state.formAssignGratificationModal.show"
    :show="state.formAssignGratificationModal.show"
    @close="state.formAssignGratificationModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formAssignGratificationModal')"
  />
  <create-scheduled-gratification-modal
    v-if="state.formCreateScheduledGratificationModal.show"
    :state="state.formCreateScheduledGratificationModal"
    @close="state.formCreateScheduledGratificationModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCreateScheduledGratificationModal')"
  />
  <close-payroll-modal
    v-if="state.formClosePayrollModal.show"
    :show="state.formClosePayrollModal.show"
    @close="state.formClosePayrollModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formClosePayrollModal')"
  />
  <close-holiday-modal
    v-if="state.formCloseHolidayModal.show"
    :show="state.formCloseHolidayModal.show"
    :state="state.formCloseHolidayModal"
    @close="state.formCloseHolidayModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formCloseHolidayModal')"
  />
  <approve-holiday-modal
    v-if="state.formApproveHolidayModal.show"
    :show="state.formApproveHolidayModal.show"
    :state="state.formApproveHolidayModal"
    @close="state.formApproveHolidayModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formApproveHolidayModal')"
  />
  <remove-user-modal
    v-if="state.formRemoveUserModal.show"
    :show="state.formRemoveUserModal.show"
    :state="state.formRemoveUserModal"
    @close="state.formRemoveUserModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formRemoveUserModal')"
  />

  <checked-news-modal
    v-if="state.formCheckedNewsModal.show"
    :show="state.formCheckedNewsModal.show"
    :state="state.formCheckedNewsModal"
    @close="state.formCheckedNewsModal.show = false"
    @change-modal="p => changeModal(p, 'formCheckedNewsModal')"
  />

  <psycho-modal
    v-if="state.formPsychoModal.show"
    :show="state.formPsychoModal.show"
    @change-modal="(p: any) => changeModal(p, 'formPsychoModal')"
  />
  <agent-status-modal
    v-if="state.formAgentStatusModal.show"
    :show="state.formAgentStatusModal.show"
    @change-modal="(p: any) => changeModal(p, 'formAgentStatusModal')"
  />
  <create-workshift-modal
    v-if="state.formCreateWorkshiftAgentModal.show"
    :show="state.formCreateWorkshiftAgentModal.show"
    :state="state.formAssignWorkshiftAgentModal"
    @change-modal="(p: any) => changeModal(p, 'formCreateWorkshiftAgentModal')"
  />
  <assign-user-workshift-modal
    v-if="state.formAssignWorkshiftAgentModal.show"
    :show="state.formAssignWorkshiftAgentModal.show"
    :state="state.formAssignWorkshiftAgentModal"
    @change-modal="(p: any) => changeModal(p, 'formAssignWorkshiftAgentModal')"
  />
  <unassign-user-workshift-modal
    v-if="state.formUnassignWorkshiftAgentModal.show"
    :show="state.formUnassignWorkshiftAgentModal.show"
    :state="state.formUnassignWorkshiftAgentModal"
    @change-modal="(p: any) => changeModal(p, 'formUnassignWorkshiftAgentModal')"
  />
  <create-holiday-modal
    v-if="state.formHolidayModal.show"
    :state="state.formHolidayModal"
    @change-modal="(p: any) => changeModal(p, 'formHolidayModal')"
  />
  <create-complaint-modal
    v-if="state.formComplaintModal.show"
    :state="state.formComplaintModal"
    @change-modal="(p: any) => changeModal(p, 'formComplaintModal')"
  />
  <create-inventory-modal
    v-if="state.formInventoryModal.show"
    :state="state.formInventoryModal"
    @change-modal="(p: any) => changeModal(p, 'formInventoryModal')"
  />
  <update-inventory-modal
    v-if="state.formUpdateInventoryModal.show"
    :state="state.formUpdateInventoryModal"
    @change-modal="(p: any) => changeModal(p, 'formUpdateInventoryModal')"
  />
  <weapon-maintenance-modal
    v-if="state.formWeaponMaintenanceModal.show"
    :state="state.formWeaponMaintenanceModal"
    @change-modal="(p: any) => changeModal(p, 'formWeaponMaintenanceModal')"
  />
  <create-news-modal
    v-if="state.formNewsModal.show"
    :state="state.formNewsModal"
    @change-modal="(p: any) => changeModal(p, 'formNewsModal')"
  />
  <business-config-modal
    v-if="state.formBusinessConfigModal.show"
    :show="state.formBusinessConfigModal.show"
    @change-modal="(p: any) => changeModal(p, 'formBusinessConfigModal')"
  />
  <confirm-modal
    v-if="state.confirmModal.show"
    :show="state.confirmModal.show"
    @change-modal="(p: any) => changeModal(p, 'confirmModal')"
  />
  <agency-modal
    v-if="state.formAgencyModal.show"
    :show="state.formAgencyModal.show"
    @change-modal="(p: any) => changeModal(p, 'formAgencyModal')"
  />
  <agency-config-modal
    v-if="state.formAgencyConfigModal.show"
    :show="state.formAgencyConfigModal.show"
    @change-modal="(p: any) => changeModal(p, 'formAgencyConfigModal')"
  />
  <physical-position-modal
    v-if="state.formPhysicalPositionModal.show"
    :show="state.formPhysicalPositionModal.show"
    @change-modal="(p: any) => changeModal(p, 'formPhysicalPositionModal')"
  />
  <user-assignment-modal
    v-if="state.formAgentAssignmentModal.show"
    :show="state.formAgentAssignmentModal.show"
    @change-modal="(p: any) => changeModal(p, 'formAgentAssignmentModal')"
  />
  <create-business-contacts-modal
    v-if="state.formBusinessContactModal.show"
    :state="state.formBusinessContactModal"
    @close="state.formBusinessContactModal.show = false"
    @change-modal="(p: any) => changeModal(p, 'formBusinessContactModal')"
  />
</template>
