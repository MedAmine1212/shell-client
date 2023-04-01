<template>
  <div  @click="goToHome" class="welcomeContainer">
    <div style="width: 100%;min-height: 1920px" v-if="currentAd != null">
      <video muted="muted" @ended="getANewAd()" :class="{ 'd-none': !currentAd.isVideo }" id="video" class="advertisementTag" autoplay>
        <source :src="currentAd.src" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <img :class="{ 'd-none': currentAd.isVideo }" class="advertisementTag" :src="currentAd.src"/>
    </div>
    <div class="spinner-container" style="margin-top: 65%" v-else >
      <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
    </div>
  </div>
</template>
<script>

  import router from "@/router";
  import AdvertisementService from "../services/AdvertisementService";
  import BorneService from "../services/BorneService";

export default {
  name: 'WelcomePage',
  data() {
    return {
      currentAd:null,
    }
  },
  methods: {
    goToHome(){
      router.push({name: "home"});
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
                } else {
                  setTimeout(()=>{
                    this.getANewAd();
                  },60000)
                }
              })
    }
  },
  created() {
   this.getANewAd();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
