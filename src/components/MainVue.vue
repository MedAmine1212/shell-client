<template>
    <div style="overflow-y: hidden" @click="inputFocus()">
    <input @keyup.enter="goToLogin" v-model="barCode" type="text" id="barCode" style="position:absolute;z-index:-1;opacity: 0"/>
    <router-view name="second"></router-view>
    <div class="liberrexTag">
        POWERED BY LIBERREX
    </div>
    </div>
</template>

<script>

    import BorneService from "../services/BorneService";
    import router from "@/router";
    import Swal from 'sweetalert2'
    import auth from "../services/auth";

    export default {
        name: 'LoginPage',
        data() {
            return {
                barCode:null,
                borne:null,
            };
        },
        mounted() {
            document.getElementById("barCode").focus();
        },
        methods: {
        inputFocus() {
            if(this.$route.name === "welcome" || this.$route.name === "home")
            document.getElementById("barCode").focus();
        },
        goToLogin() {
            if(this.barCode != null)
                auth.actions.setBarCode(this.barCode);
            router.push({name: "login"});
        },
        borneError() {
            Swal.fire({
                position: 'top-end',
                background: "rgb(252, 226,74)",
                icon: "error",
                iconColor: "red",
                color: "red",
                text: 'Error: borne disconnected !',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 1500
            });
            router.push({name: "initiateBorne"});
        },
        pingBorne() {
            setInterval(()=>{
                BorneService.pingBorne(BorneService.getBorneId())
                    .catch((err)=>{
                        this.borneError();
                        console.log(err);
                    })
            },((this.borne.heartBeatInterval*60)-10)*1000)
            }
        },
        created() {
          if(BorneService.getBorneId() == null) {
              router.push({name: "initiateBorne"});
          } else {
              BorneService.findBorneById(BorneService.getBorneId())
                  .then((res)=>{
                    this.borne = res.data.borne;
                      BorneService.pingBorne(BorneService.getBorneId())
                          .then(()=>{
                              console.log("startedPinging");
                              this.pingBorne();
                          })
                  })
                  .catch((err)=>{
                      console.log(err);
                     this.borneError();
                  })
          }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
