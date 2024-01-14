<template>
  <MarmaidGraph :code="MINDMAP" />
</template>

<script setup>
//==================================
// Import
//==================================
import MarmaidGraph from "@/components/MarmaidGraph.vue";


//==================================
// Consts
//==================================
const MINDMAP = `
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
</script>