<template>
  <router-view></router-view>
</template>

<script>

import BorneService from "./services/BorneService";
import router from "@/router";
export default {
  name: 'App',
  created() {
    if(!BorneService.getBorneId()) {
      router.push({name: "initiateBorne"});
    }
  }
}
</script>

<style>
  @import './assets/main.css';
  @font-face {
    font-family: "Inter";
    src: local("Inter"),
    url(./fonts/Inter-VariableFont_slnt,wght.ttf) format("truetype");
  }
#app {
  font-family: 'Inter', serif;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */

}

</style>
