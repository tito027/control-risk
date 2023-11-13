<script lang="ts" setup>
import BaseTable from "@/components/tables/Base.vue"
</script>
<template>
  <div class="mt-4 row">
    <div class="col-12">
      <div class="card">
        <!-- Card header -->
        <div
          class="card-header d-flex align-items-center justify-content-between w-100"
        >
          <div>
            <h5 class="mb-0">Check In / Out History</h5>
            <p class="mb-0 text-sm">
              A continuación se listan todos los registros de entradas y salidas
              de agentes.
            </p>
          </div>
        </div>
        <div class="table-responsive">
          <base-table
            :columns="[
              {
                label: 'Carnet',
                prop: 'carnet',
                minWidth: 100,
              },
              {
                label: 'Nombre',
                prop: 'nombre',
                minWidth: 180,
              },
              {
                label: 'Acción',
                prop: 'accion',
                minWidth: 100,
              },
              {
                label: 'Fecha',
                prop: 'fecha',
                minWidth: 120,
                type: 'date',
              },
              {
                label: 'Hora de marcado',
                prop: 'hora',
                minWidth: 120,
                type: 'time',
              },
              {
                label: 'Posición',
                prop: 'posicion',
                minWidth: 180,
              },
              {
                label: 'Motivo de tiempo',
                prop: 'razonTiempo',
                minWidth: 280,
              },
              {
                label: 'Motivo de posición',
                prop: 'razonPosicion',
                minWidth: 180,
              },
            ]"
            endpoint="/check-in-out/history"
          >
          </base-table>
        </div>
      </div>
    </div>
  </div>
</template>
