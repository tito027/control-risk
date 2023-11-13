<script lang="ts" setup>
import BaseTable from "@/components/tables/Base.vue"
import { Entries } from "control-risk/entries.schema"
import { DateTime } from "luxon"
import ArgonCheckbox from "@/components/ArgonCheckbox.vue"
import { PhysicalPositionDocument } from "control-risk/schemas/physicalPosition.schema"
import { BusinessDocument } from "control-risk/schemas/business.schema"
import { WorkdayDocument } from "control-risk/schemas/workday.schema"
function dateFormatter(row: any, column: any) {
  return "ola"
}
const now = DateTime.now().startOf("day")
function formatMilitar(seconds: number) {
  return now.plus({ seconds }).toFormat("hh:mm")
}

function map(entrie: Entries, i: number) {
  const checkIn = DateTime.fromISO(entrie.checkIn.createdAt)
  const checkOut = DateTime.fromISO(entrie.checkOut.createdAt)
  const duty: number =
    (((entrie.schedule as WorkdayDocument).schedule[entrie.checkData.key]
      .checkOut -
      (entrie.schedule as WorkdayDocument).schedule[entrie.checkData.key]
        .checkIn) /
      100) *
    60 *
    60

  const worked = Math.round(checkOut.diff(checkIn).as("hours") * 60 * 60)
  return {
    carnet: entrie.checkIn.user.carnet,
    name: `${entrie.checkIn.user.userInformation.name} ${entrie.checkIn.user.userInformation.lastname}`,
    project: (
      (entrie.checkIn.physicalPosition as PhysicalPositionDocument).agency
        .business as BusinessDocument
    ).nickname,
    position: {
      name: (entrie.checkIn.physicalPosition as PhysicalPositionDocument).agency
        .name,
      reason: entrie.checkIn.positionReason?.reason,
    },
    schedule:
      DateTime.fromFormat(
        entrie.checkIn.schedule.checkInTime.toString().padStart(4, "0"),
        "HHmm"
      ).toFormat("hh:mm a") +
      " - " +
      DateTime.fromFormat(
        entrie.checkIn.schedule.checkOutTime.toString().padStart(4, "0"),
        "HHmm"
      ).toFormat("hh:mm a"),
    duty: formatMilitar(duty),
    startTime: {
      time: checkIn.toFormat("hh:mm a"),
      reason: entrie.checkIn.timeReason?.reason,
    },
    endTime: {
      time: checkOut.invalidReason
        ? "Sin salida"
        : checkIn.day === checkOut.day
        ? checkOut.toFormat("hh:mm a")
        : checkOut.toFormat("dd hh:mm a"),
      reason: entrie.checkOut?.timeReason?.reason,
    },
    worked: checkOut.invalidReason ? "No determinado" : formatMilitar(worked),
    regular:
      worked > duty &&
      !(
        (entrie.checkIn.physicalPosition as PhysicalPositionDocument).agency
          .business as BusinessDocument
      ).extraMode
        ? formatMilitar(duty)
        : formatMilitar(worked),
    extra_on_week: (
      (entrie.checkIn.physicalPosition as PhysicalPositionDocument).agency
        .business as BusinessDocument
    ).extraMode,
    extra:
      worked > duty &&
      !(
        (entrie.checkIn.physicalPosition as PhysicalPositionDocument).agency
          .business as BusinessDocument
      ).extraMode
        ? formatMilitar(worked - duty)
        : 0,
    holiday: "0",
    descTime:
      !!entrie.checkIn.timeReason?.reason ||
      !!entrie.checkOut?.timeReason?.reason,
    descPosition:
      !!entrie.checkIn.positionReason?.reason ||
      !!entrie.checkOut?.positionReason?.reason,
  }
}
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
            <h5 class="mb-0">Validación Check In / Out</h5>
            <p class="mb-0 text-sm">
              A continuación se listan las entradas de los agentes pendientes de
              aprobación.
            </p>
          </div>
        </div>
        <div class="table-responsive">
          <base-table
            :default-filters="[
              {
                value: [
                  DateTime.now().startOf('day').toJSDate(),
                  DateTime.now().endOf('day').toJSDate(),
                ],
                type: 'simple-date',
                column: 'createdAt',
                label: 'Fecha',
              },
            ]"
            :columns="[
              {
                label: 'Proyecto',
                prop: 'project',
                minWidth: 200,
              },
              {
                label: 'Posición',
                prop: 'position',
                minWidth: 200,
              },
              {
                label: 'Carnet',
                prop: 'carnet',
                minWidth: 100,
              },
              {
                label: 'Nombre',
                prop: 'name',
                minWidth: 180,
              },
              {
                label: 'Horario',
                prop: 'schedule',
                minWidth: 200,
              },
              {
                label: 'Turno',
                prop: 'duty',
                minWidth: 125,
              },
              {
                label: 'Marcaje (Inicio)',
                prop: 'startTime',
                minWidth: 150,
              },
              {
                label: 'Marcaje (Final)',
                prop: 'endTime',
                minWidth: 150,
              },
              {
                label: 'Horas trabajadas',
                prop: 'worked',
                minWidth: 150,
              },
              {
                label: 'Sobre 44 horas',
                prop: 'extra_on_week',
                minWidth: 150,
              },
              {
                label: 'Horas regulares',
                prop: 'regular',
                minWidth: 150,
              },
              {
                label: 'Horas extra',
                prop: 'extra',
                minWidth: 150,
              },
              {
                label: 'Horas en asueto',
                prop: 'holiday',
                minWidth: 150,
              },
              {
                label: 'Descuento por tiempo',
                prop: 'descTime',
                minWidth: 150,
              },
              {
                label: 'Descuento por posición',
                prop: 'descPosition',
                minWidth: 150,
              },
            ]"
            :map="map"
            endpoint="/entries/list"
          >
            <template #position="{ row, column }">
              {{ row[column.property].name }}
              <el-tooltip
                v-if="row[column.property].reason"
                class="box-item"
                effect="dark"
                :content="row[column.property].reason"
                placement="bottom"
              >
                <i class="fas fa-exclamation-circle text-danger"></i>
              </el-tooltip>
            </template>
            <template #startTime="{ row, column }">
              {{ row[column.property].time }}
              <el-tooltip
                v-if="row[column.property].reason"
                class="box-item"
                effect="dark"
                :content="row[column.property].reason"
                placement="bottom"
              >
                <i class="fas fa-exclamation-circle text-danger"></i>
              </el-tooltip>
            </template>
            <template #endTime="{ row, column }">
              {{ row[column.property].time }}
              <el-tooltip
                v-if="row[column.property].reason"
                class="box-item"
                effect="dark"
                :content="row[column.property].reason"
                placement="bottom"
              >
                <i class="fas fa-exclamation-circle text-danger"></i>
              </el-tooltip>
            </template>
            <template #extra_on_week="{ row, column }">
              <argon-checkbox disabled :checked="row[column.property]" />
            </template>
            <template #descTime="{ row, column }">
              <argon-checkbox :checked="row[column.property]" />
            </template>
            <template #descPosition="{ row, column }">
              <argon-checkbox :checked="row[column.property]" />
            </template>
          </base-table>
        </div>
      </div>
    </div>
  </div>
</template>
