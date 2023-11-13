<script lang="ts" setup>
import { AgentsModule } from "@/store/modules/Agents"
import ArgonBadge from "@/components/ArgonBadge.vue"
import DocItem from "./DocItem.vue"
import { DocsProps } from "../../../../composables/DataDocsComposables"
import { Field, InputTypes } from "@/types/components"
import { AlertState, ExpireTime } from "@/types/app"
import { AlertColorByStatus, AlertIconByStatus } from "@/plugins/error"
import {  PsychicDocument } from 'control-risk/schemas/psychic.schema';
import { Test, TestModule } from "@/store/modules/Tests"
import { DateTime } from "luxon"

export interface Props {
  icon?: string
  state?: AlertState
  test: PsychicDocument
  isVisualization?: boolean
  answerID?: string
  createdAt?:string
  evaluatedBy?: string
}
const props = withDefaults(defineProps<Props>(),{
  isVisualization:false,
  answerID:'',
  createdAt:'',
  evaluatedBy:'',
  icon:'fa-mandalorian',
  state: AlertState.info
});

const openModal = (_id:string)=>{
  TestModule.setDocumentById(_id);
  if(props.isVisualization){
    TestModule.pullAnswerById(props?.answerID)
    TestModule.setOverviewOpenModal(true);
  }else{
    TestModule.setOpenModal(true);
  }
}
function getColor() {
  return props.state
    ? `text-${props.state}`
    : "text-info"
}
function getFooter(){
  if (props.isVisualization){
    const date = DateTime.fromISO(props.createdAt);
   return `Evaluado por ${props.evaluatedBy} el ${date.toFormat('dd/MM/yyyy hh:mm a')}` 
  } else  {
    return props.test.indication
  }
}
</script>
  <template #title :name="props.test._id">
    <div></div>
      <div class="d-flex align-items-center h-100 w-100">
        <div class="text-center w-5 ms-1">
          <i class="fas fa-w"></i>
          <i class="text-lg opacity-6 fas fa-w " :class="props.icon"></i>
        </div>
        <div class="my-auto ms-3">
          <div class="h-100 w-100">
            <p
              class="text-sm mb-1"
              style="
                max-height: 1.4em;
                overflow: hidden;
                white-space: pre-wrap;
                text-overflow: ellipsis;
              "
            >
              {{ props.test.name }}
            </p>

            <p class="mb-0 text-xs " :class="getColor()">
              {{ getFooter() }}

            </p>
          </div>
        </div>
        <argon-badge :color="getColor()" size="sm" class="my-auto ms-auto me-3">
          <i class="fas fs-7 fa-plus-circle"></i>
        </argon-badge>
        <a
          v-if="!isVisualization"
          @click="openModal(props.test._id)"
          href="javascript:;"
          class="text-primary text-sm icon-move-right my-auto me-1"
        >
          Realizar
          <i class="fas fs-7 fa-plus-circle"></i>
        </a>
        <a
          v-if="isVisualization"
          @click="openModal(props.test._id)"
          href="javascript:;"
          class="text-primary text-sm icon-move-right my-auto me-1"
        >
          Visualizar
          <i class="fas fs-7 fa-eye"></i>
        </a>
      </div> 
    </template>

