<template>
  <div
    ref="graph_ref"
    class="full-size"
    v-html="svg"
    :style="{ 'transform': `scale(${zoom})` }"
  />
</template>

<script setup>
//==================================
// Import
//==================================
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import mermaid from "mermaid";


//==================================
// Props
//==================================
const props = defineProps({
  code: String,
});


//==================================
// Consts
//==================================
const svg = ref(undefined);
const zoom = ref(1);
const graph_ref = ref(undefined);


//==================================
// Functions
//==================================
function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
  });
}

function drawGraph() {
  mermaid.render('svg-id', props.code, graph_ref.value).then(
    (res) => {
      svg.value = res.svg;
    },
    (err) => {
      console.error("error: ", err);
    }
  );
}

function onWheel(e) {
  const zoom_in = e.deltaY < 0;
  zoom.value = zoom_in ? zoom.value * 1.1 : zoom.value * 0.9;
}

//==================================
// Life cycle
//==================================
onMounted(() => {
  initMermaid();
  drawGraph();
  window.addEventListener("wheel", onWheel);
});

onBeforeUnmount(() => {
  window.removeEventListener("wheel", onWheel);
});
</script>

<style lang="scss" scoped>
.full-size {
  width: 100%;
  height: 100vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>
