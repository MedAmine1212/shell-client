<template>
    <div @click="focusOnInput()" class="loginContainer">
        <img src="../assets/images/Shell-Logo.png" width="347" height="195"><br><br>
        <div style="height:202px" v-if="!padClicked"></div>
        <img src="../assets/images/barCode.png" width="255" style="margin-top: 20px" height="212"><br>
        <h1 class="scan-text">SCAN YOUR {{type}} CARD</h1>
        <h1 class="scan-text-2">PLEASE SCAN THE BAR CODE OF YOUR SHELL CARD</h1><br>
        <input @keyup.enter="clickPad(10)" @click="padClicked = true" v-model="padValue" id="loginInput" type="text" class="loginInput" placeholder="CLICK HERE TO TYPE IN YOU CARD CODE"/><br><br>
        <div v-if="padClicked" class="pad-container">
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
                    <div @click="clickPad(10)" class="confirm red">CONFIRM</div>
                </div>
            </div>
        </div>
        <div class="spinner-container" v-if="sending" >
            <div class="spinner-grow text-danger spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2'
    import auth from './../services/auth.js'
    import router from "@/router";
    export default {
        name: 'LoginPage',
        data() {
            return {
                type: "",
                sending: false,
                padValue: "",
                padClicked: false
            };
        },
        created() {
            if(auth.actions.getCLientToken() == null) {
                this.type = "CLIENT";
            } else {
                this.type = "EMPLOYEE";
            }
            if(auth.actions.getBarCode() != null) {
                this.padValue = auth.actions.getBarCode();
                auth.actions.removeBarCode();
                this.clickPad(10);
            }

        },
        mounted() {
            this.focusOnInput();
        },
        methods: {
            focusOnInput() {
                if(document.getElementById("loginInput"))
                    document.getElementById("loginInput").focus();
            },
            async clickPad(num) {
                if (num === -1) {
                    if (this.padValue.length > 0)
                        document.getElementById("loginInput").value = this.padValue.slice(0, this.padValue.length - 1);
                } else if (num === 10) {
                    if (isNaN(this.padValue) || this.padValue.length === 0) {
                        await Swal.fire({
                            position: 'top-end',
                            background: "rgb(252, 226,74)",
                            icon: "error",
                            iconColor: "red",
                            color: "red",
                            text: 'Invalid code !',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        if (!this.sending) {
                            this.sending = true;
                            await auth.actions.authenticate(this.padValue)
                                .then( async (res) => {
                                    if(res.data.user_type === "client"){
                                        await auth.actions.setClientToken(res.data.access_token);
                                        await auth.actions.setClientBarCode(this.padValue);
                                    }
                                    else
                                        await auth.actions.setEmployeeToken(res.data.access_token);
                                    router.push({name: "home"});
                                    this.sending = false;
                                })
                                .catch(error => {
                                    this.sending = false;
                                    this.padValue = "";
                                    this.focusOnInput();
                                    console.log(error);
                                    Swal.fire({
                                        position: 'top-end',
                                        background: "rgb(252, 226,74)",
                                        icon: "error",
                                        iconColor: "red",
                                        color: "red",
                                        text: 'User not found !',
                                        timerProgressBar: true,
                                        showConfirmButton: false,
                                        timer: 1500
                                    });
                                });
                            }
                        }
                } else if (num === -2) {
                    document.getElementById("loginInput").value = "";
                } else
                    document.getElementById("loginInput").value += num;
                this.focusOnInput();
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
