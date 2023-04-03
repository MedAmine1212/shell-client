<template>
  <div class="homePageContainer">
    <!--header-->
    <div class="advertisement">
      <img v-if="currentAd" src="../assets/images/Shell-Logo.png" style="position: absolute;z-index: 999;top:65%;left:24px" width="174" height="98">
      <div style="width: 100%;height: 100%" v-if="currentAd != null">
        <video class="advertisementTag" muted="muted" :class="{ 'd-none': !currentAd.isVideo }" id="video" loop autoplay>
          <source :src="currentAd.src" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <img :class="{ 'd-none': currentAd.isVideo }" style="width: 100% !important;height: 100%" :src="currentAd.src"/>
      </div>
      <div class="spinner-container" v-else >
        <div class="spinner-grow text-danger spinner" style="width: 60px;height: 60px" role="status"><span class="sr-only">Loading...</span></div>
      </div>
    </div>
    <div class="barcodeTag">
      <img src="../assets/images/barCode.png" width="130" height="108">
      <h1 class="homePageTitle">PLEASE SCAN THE BAR CODE ON YOUR SHELL CARD</h1>
    </div>
    <!--main-->
    <div class="mainDiv">
      <div class="mainButtonsContainer">
        <div>
          <router-link to="/main/maintenance"><button class="btn mainMenuButton"><img style="margin-right: 10px;margin-left: 5px" src="../assets/images/entretien.png" width="64" height="64"/> MAINTENANCE</button></router-link>
          <router-link to="/main/diagnostics"><button class="btn mainMenuButton"><img style="margin-right: 10px;margin-left: 5px" src="../assets/images/diagnostics.png" width="64" height="64"/>DIAGNOSTIC</button></router-link>
        </div>
        <div>
          <router-link v-if="!isLoggedIn()" to="/main/newClient"><button class="btn mainMenuButton"><img style="margin-right: 10px;margin-left: 5px" src="../assets/images/newClient.png" width="64" height="64"/>NEW CLIENT</button></router-link>
          <router-link v-else to="/main/summary"><button class="btn mainMenuButton"><span style="margin-right: 28px;margin-left: 15px;font-size: 50px"><i class="far fa-file"></i></span>SUMMARY</button></router-link>
          <router-link to="/main/shop"><button class="btn mainMenuButton"><img style="margin-right: 10px;margin-left: 5px" src="../assets/images/shop.png" width="64" height="64"/>SHOP</button></router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>


import AdvertisementService from "../services/AdvertisementService";
import BorneService from "../services/BorneService";
import auth from "../services/auth";

export default {
  name: 'HomePage',
  data() {
    return {
      currentAd:null
    }
  },
  methods: {
    isLoggedIn() {
      return auth.actions.getCLientToken() != null;
    },
    getANewAd() {
      this.currentAd = null;
      AdvertisementService.getARandomAd(BorneService.getBorneId())
              .then((res)=>{
                this.currentAd = res.data.advertisement.advertisement;
                this.currentAd.src = process.env.VUE_APP_API_BASE_URL+'ads/'+this.currentAd.file;
                if(this.currentAd.isVideo) {
                  setTimeout(()=>{
                    document.getElementById("video").play();
                  },500);
                }
              })
    }
    },
  created() {
    this.getANewAd();
  }
}
</script>