<template>
    <div class="loginContainer">
        <img src="../assets/images/Shell-Logo.png" width="555" height="312">
        <div style="margin-top: 20%"><h1 class="scan-text">INITIATE BORNE</h1><br><br>
        <input v-model="borne_id" class="loginInput" style="width: 90%;height: 150px;font-size: 60px !important;text-align: center" type="text" placeholder="Borne id"><br><br><br>
            <div class="pad-container">
                <div class="pad">
                    <div class="pad-elements">
                        <div @click="clickPad(1)" class="pad-element">1</div>
                        <div @click="clickPad(2)" class="pad-element">2</div>
                        <div @click="clickPad(3)" class="pad-element">3</div>
                        <div @click="clickPad(4)" class="pad-element">4</div>
                        <div @click="clickPad(5)" class="pad-element">5</div>
                        <div @click="clickPad(6)" class="pad-element">6</div>
                        <div @click="clickPad(7)" class="pad-element">7</div>
                        <div @click="clickPad(8)" class="pad-element">8</div>
                        <div @click="clickPad(9)" class="pad-element">9</div>
                        <div @click="clickPad(-2)" class="pad-element red">X</div>
                        <div @click="clickPad(0)" class="pad-element">0</div>
                        <div @click="clickPad(-1)" class="pad-element red">&lt;</div>
                    </div>
                    <div style="display: flex;justify-content: center;width: 100%  ">
                        <button @click="getBorne()" :disabled="sending" class="confirm red">Initiate</button>
                    </div>
                </div>
            </div>
        <div class="spinner-container" v-if="sending" >
            <div class="spinner-grow text-danger spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2'
    import BorneService from "../services/BorneService";
    import router from "@/router";
    // import router from "@/router";
    export default {
        name: 'LoginPage',
        data() {
            return {
                borne_id:"",
                sending: false,
            };
        },
        methods: {
            async clickPad(num) {
                if (num === -1) {
                    if (this.borne_id.length > 0)
                        this.borne_id = this.borne_id.slice(0, this.borne_id.length - 1);
                } else if (num === -2) {
                    this.borne_id = "";
                } else
                    this.borne_id += num;
            },
        async getBorne() {
            if (this.sending)
                return;
            if(this.borne_id.length ===0 || isNaN(this.borne_id)) {
                await Swal.fire({
                    position: 'top-end',
                    background: "rgb(252, 226,74)",
                    icon: "error",
                    iconColor: "red",
                    color: "red",
                    text: 'Invalid borne id !',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1500
                })
                return;
            }
            this.sending = true;
            BorneService.findBorneById(this.borne_id)
                .then((res)=>{
                    BorneService.setBorneId(res.data.borne.id);
                    BorneService.setStationId(res.data.borne.station_id);
                    this.sending = false;
                    router.push({name: "welcome"});
                })
                .catch((err)=>{
                    console.log(err);
                    this.sending = false;
                    Swal.fire({
                        position: 'top-end',
                        background: "rgb(252, 226,74)",
                        icon: "error",
                        iconColor: "red",
                        color: "red",
                        text: 'Borne not found !',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    })
                })

         },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
