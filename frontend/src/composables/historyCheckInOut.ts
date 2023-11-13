import { ref } from 'vue';
import api from '../store/api/index';

export function historyCheckInOut() {
  let history = ref({
    data: []
  });
  let loading = ref(false);

  async function getHistory(filters: Object) {
    loading.value = true;
    await api.post('/check-in-out/history', filters).then(res => {
      history.value = res.data;
    }).finally(() => {
      loading.value = false;
    })
  }

  return {
    history,
    loading,
    getHistory
  }
}
