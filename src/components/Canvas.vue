<template>
  <canvas ref="canvas_ref" :width="width" :height="height"></canvas>
</template>

<script setup>
//==================================
// Import
//==================================
import { onMounted, ref } from "vue";


//==================================
// Props and emits
//==================================
const props = defineProps({
  width: Number,
  height: Number,
});

//==================================
// Consts
//==================================
const canvas_ref = ref( undefined );
const ctx        = ref( undefined );

defineExpose({
  ctx,
})

//==================================
// Import
//==================================
onMounted( () => {
  ctx.value = canvas_ref.value.getContext("2d");
});

</script>

<style lang="scss" scoped>
  canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #222;
  }
</style>
