<template>
    <div class="wheel-of-fortune">
        <audio
            v-if="chances.length"
            id="fastAudio"
            hidden="true"
            ref="audio"
            loop
        >
            <source src="../assets/fastwheel.mp3"/>
        </audio>
        <audio
            v-if="chances.length"
            id="slowAudio"
            hidden="true"
            ref="audio"
        >
            <source src="../assets/slowwheel3.mp3"/>
        </audio>
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-danger spinner"  role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="chances.length" class="wheel-container">
            <img src="../assets/images/wheelnose.png" height="103" width="39" style="z-index: 9999;margin-top: 95px;filter: drop-shadow(0 0 0.35rem black)"/>
            <div id="wheel" :style=" {transform: 'rotate('+degree+'deg)'}" class="chances" @click="rotateWheel()" title="Click to rotate">
                <li v-for="(chance, index) in chances" :id="chance.wheel_trophy.id" :key="index" class="chance" :style="{transform: 'rotate('+(index * (360/chances.length))+'deg) skewY(-'+(90-(360/chances.length))+'deg)',background: index %2 !== 0 ? '#FEFBE8' : '#FB1613'}">
                    <div class="chance-label" :style="{transform: 'skewY('+(90-(360/chances.length))+'deg) rotate('+((360/chances.length)/2)+'deg)'}">
                        <img style="filter: drop-shadow(0 0 0.35rem black)" width="38" height="41" src="../assets/images/wheel-tick.png"/><br>
                        <div style="filter: drop-shadow(0 0 0.05rem black);margin-top: 80px;margin-left: -20px" :style="{color:  index %2 !== 0 ? '#FB1613' : '#FEFBE8', transform: 'rotate(-88deg)'}">
                        {{ chance.wheel_trophy.label }}
                        </div>
                    </div>
                </li>
            </div>
            <img src="../assets/images/wheelcenter.png" height="150" width="148" style="filter: drop-shadow(0 0 0.75rem black);z-index: 9999;margin-top: 39%;position: absolute"/>
        </div>
        <div style="text-align: center;width: 100%;filter: drop-shadow(0 0 0.35rem black);color: white;font-weight: bolder;font-size: 70px;margin-top: 400px" v-else>
            Wheel of fortune not available at the moment.
        </div>
    </div>
</template>

<script>


    import WheelOfFortuneService from "@/services/WheelOfFortuneService";
    import Swal from "sweetalert2";

    export default {
        name: 'WheelOfFortune',
        data() {
            return {
                loading:true,
                theWheel:null,
                degree:1,
                chances:[],
                degreesToAdd:3600,
                rotationInterval:null,
                rotated:false,
            };
        },
        mounted() {
        },
        methods: {
            rotateWheel() {
                if (this.rotated) return;
                document.getElementById("fastAudio").play();
                setTimeout(()=>{
                    this.degree += this.degreesToAdd;
                    this.rotationInterval = setInterval(()=>{
                        this.degree += this.degreesToAdd;
                        this.degreesToAdd/=2;
                    },1500);
                    this.rotated = true;
                    WheelOfFortuneService.play()
                        .then((res)=>{
                            this.showResults(res.data.chance);
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                },50);


            },
            showResults(chance) {
                clearInterval(this.rotationInterval);
                document.getElementById("slowAudio").play();
                document.getElementById("fastAudio").pause();
                for(let i = 0;i<this.chances.length;i++) {
                    if(chance.id === this.chances[i].wheel_trophy.id) {
                        this.degree =this.degreesToAdd+(360- (((360/this.chances.length)*i)+Math.floor(Math.random() * (360/this.chances.length))));
                        setTimeout(()=>{
                            if(!chance.nonProfitable)
                            Swal.fire(
                                'Congratulations !',
                                'You won <b>'+chance.label+'</b>',
                                'success'
                            );
                            else {
                                Swal.fire(
                                    'Oops !',
                                    'Better luck next time',
                                    'warning'
                                );
                            }
                        },2200)

                        break;
                    }
                }
            }
        },
        created() {
            WheelOfFortuneService.getChancesByBorneId()
                .then((res)=>{
                    let i =0
                    while(res.data.chances.length < 4) {
                        res.data.chances.push(res.data.chances[i++]);
                    }
                    if(res.data.chances.length % 2 !== 0) {
                        res.data.chances.push(res.data.chances[0]);
                    }
                    this.chances = res.data.chances;
                    this.loading = false;
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
