<template>
  <RouterView />
  <Btn v-if="$route.name != 'nav'" class="back-btn" @click="$router.push('/')">Back</Btn>
</template>

<script setup>
//==================================
// Import
//==================================
import Btn from './components/Btn.vue';
import { RouterView } from "vue-router";

</script>

<style lang="scss" scoped>
  .back-btn {
    position: fixed;
    left: 12px;
    bottom: 12px;
  }
</style>