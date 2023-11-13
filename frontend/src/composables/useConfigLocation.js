import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import api from '../store/api/index';

export function useConfigLocation() {
  let business = ref({
    data: []
  });
  let agencies = ref({
    data: []
  });
  let physicalPositions = ref({
    data: []
  });
  let loginData = ref({
    data: {}
  });
  let loading = ref(false);

  async function adminLogin(options) {
    loading.value = true;
    await api.post('/auth/basic', options).then(res => {
      ElMessage({
        message: res.data.message,
        type: "success",
      })
      loginData.value = res.data;
    }).catch((e) => {
      ElMessage({
        message: e.response.data.error.message,
        type: "error",
      })
    }).finally(() => {
      loading.value = false;
    });
  }

  function fetchBusiness() {
    loading.value = true;
    api.get('business').then(res => {
      business.value = res.data;
    }).finally (() => loading.value = false);
  }

  async function fetchAgencies(id) {
    loading.value = true;
    await api.get(`business/find/agencies/${id}`).then(res => {
      agencies.value = res.data;
    }).finally (() => loading.value = false);
  }

  async function fetchPhysicalPositions(id) {
    loading.value = true;
    await api.get(`agencies/find/physicalpositions/${id}`).then(res => {
      physicalPositions.value = res.data;
    }).finally (() => loading.value = false);
  }

  async function updateCoordinates(physicalPositionId, coordinates) {
    await api.post(`physical-position/update-coordinates/${physicalPositionId}`, coordinates).then(res => {
      ElMessage({
        message: 'Se han actualizado las coordenadas correctamente',
        type: 'success',
      })
    }).catch((e) => {
      ElMessage({
        message: 'No se han actualizado las coordenadas correctamente',
        type: 'error',
      })
    })
  }

  return {
    business,
    agencies,
    physicalPositions,
    loginData,
    loading,
    fetchBusiness,
    fetchAgencies,
    fetchPhysicalPositions,
    adminLogin,
    updateCoordinates,
  }
}