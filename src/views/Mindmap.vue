<template>
  <div ref="graph_ref" class="full-size" v-html="svg" />
</template>

<script setup>
//==================================
// Import
//==================================
import { 
  ref,
  onMounted,
} from "vue";

import mermaid from "mermaid";


//==================================
// Import
//==================================
const svg       = ref( undefined );
const graph_ref = ref( undefined );
const graph = `
mindmap
  root((zero))
    first
      second
      second
        third
        third
        third
    first
      second
      second
      second
        third
        third
        third
    first
      second
        third
        third
        third
`;


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
  mermaid.render('graphDiv', graph).then(
    (res) => {
      svg.value = res.svg;
    },
    (err) => {
      console.err( 'error: ', err);
    }
  )
};

//==================================
// Life cycle
//==================================
onMounted(() => {
  initMermaid();
  drawGraph();
});


</script>

<style lang="scss" scoped>
.full-size {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
