
<template>
  <div>
    <select v-model="opcionSeleccionada" @change="actualizarSeleccion" style="height:36px; margin-top: 4px;">
      <option value="" disabled selected>Seleccione</option>
      <option v-for="opcion in opciones" :value="opcion" :key="opcion">
        {{ opcion }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomDropdown",
  props: {
    opcionSeleccionada: {
      type: String,
      default: "",
    },
    opciones: {
      type: Array<string>,
      default: [],
    },
  },
  emits: ['update:opcionSeleccionada'], // Declarar el evento que se emitirá
  setup(props, { emit }) {
    const actualizarSeleccion = (event: Event) => {
      const opcionSeleccionada = (event.target as HTMLSelectElement).value;
      emit('update:opcionSeleccionada', opcionSeleccionada); // Emitir el evento con la opción seleccionada
    };

    return {
      opcionSeleccionada: props.opcionSeleccionada,
      actualizarSeleccion,
    };
  },
});
</script>

