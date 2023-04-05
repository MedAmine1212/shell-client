<template>
  <div style="overflow-y: auto !important;" class="loginContainer">
    <img src="../assets/images/Shell-Logo.png" width="347" height="195"><br><br>
    <h1 class="scan-text" style="margin-top: 80px">CREATE YOUR SHELL ACCOUNT</h1>
    <h1 class="scan-text-2" style="margin-bottom: 80px">PLEASE FILL IN THIS FORM</h1><br>

    <div v-if="!loading" class="mainButtonsContainer">
      <div class="inputContainer">
        <input v-model="client.firstName" type="text" class="newClientInput" placeholder="FIRSTNAME"/>
        <input v-model="client.lastName" type="text" class="newClientInput" placeholder="LASTNAME"/>
      </div>
      <div class="inputContainer">
        <input v-model="client.phone" type="text" class="newClientInput" placeholder="Phone number"/>
        <input v-model="client.email" type="email" class="newClientInput" placeholder="EMAIL"/>
      </div>
      <div class="inputContainer">
        <v-autocomplete @change="getModels"
                        id="modelsSelect"
                        :items="brands"
                        v-model="vehicle.brand"
                        label="BRAND"
                        class="newClientInput">
        </v-autocomplete>
        <v-autocomplete v-model="vehicle.model"
                        :items="models"
                        label="MODEL"
                        class="newClientInput">
        </v-autocomplete>
      </div>
      <div class="inputContainer">
        <select v-model="vehicle.fueltype" style="border:1px solid rgba(255,255,255,1) !important;" class="newClientInput selected-def">
          <option value="" disabled selected>ENGINE</option>
          <option value="petrol">Gasoline (petrol)</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <input v-model="vehicle.year" type="text" class="newClientInput" placeholder="YEAR"/>
      </div>
      <div class="inputContainer">
        <input v-model="vehicle.matricule" type="text" class="newClientInput" placeholder="Licence plate (xxxTUNxxxx)"/>
        <input v-model="vehicle.mileage" type="email" class="newClientInput" placeholder="Mileage (KM)"/>
      </div>
      <div style="margin-top: 30px" class="inputContainer">
        <button :disabled="sending" @click="createClient()" class="confirm create">
          <span v-if="!sending">CREATE MY ACCOUNT</span>
          <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
        </button>
      </div>
      <div class="inputContainer">
        <router-link style="width: 100%" to="/main/home"><button style="background-color: #DA2700 !important;" class="confirm create">CANCEL</button></router-link>
      </div>
    </div>
  </div>
</template>
<script>


import Swal from 'sweetalert2'
import VehicleService from "../services/VehicleService";
import { VAutocomplete } from 'vuetify/lib/components/VAutocomplete/VAutocomplete'
import ClientService from "../services/ClientService";
import router from "@/router";
import auth from "../services/auth";
export default {
  name: 'NewClient',
  data() {
    return {
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      // matriculeRegex: /^\d{3}TUN\d{4}$/,
      loading:true,
      client:null,
      sending:false,
      vehicle:null,
      userAdded: false,
      currentClient: null,
      brands: [],
      models: [],
    }
  },
  components:{
    VAutocomplete
  },
  methods: {
    getModels() {
      VehicleService.getModelsByBrand(this.vehicle.brand)
              .then((res)=>{
                this.vehicle.model = "";
                this.models = res.data.models;
                this.models = Object.values(this.models);
                });
    },
    fireError(text) {
      Swal.fire({
        position: 'top-end',
        background: "rgb(252, 226,74)",
        icon: "error",
        iconColor: "red",
        color: "red",
        text: text,
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 1500
      })
    },
    verifyInputs() {
      if(!this.userAdded) {
      if(this.client.firstName.length ===0) {
        this.fireError("First name required");
        return false;
      }
      if(this.client.lastName.length ===0) {
        this.fireError("Last name required");
        return false;
      }
      if(this.client.phone.length !==8 || isNaN(this.client.phone)) {
        this.fireError("Invalid phone number");
        return false;
      }
      if(!this.emailRegex.test(this.client.email)) {
        this.fireError("Invalid email");
        return false;
      }
      }
      if(this.vehicle.brand.length === 0) {
        this.fireError("Car brand required");
        return false;
      }

      if(this.vehicle.model.length === 0) {
        this.fireError("Car model required");
        return false;
      }

      if(this.vehicle.fueltype.length === 0) {
        this.fireError("Engine type required");
        return false;
      }


      if(this.vehicle.year.length !== 4 || isNaN(this.vehicle.year)) {
        this.fireError("invalid year");
        return false;
      }

      if(this.vehicle.matricule.length < 4) {
        this.fireError("invalid licence plate");
        return false;
      }

      if(isNaN(this.vehicle.mileage) ||this.vehicle.mileage.length ===0){
        this.fireError("invalid mileage value");
        return false;
      }
    return true;
    },
    createClient() {
      if(this.sending)
        return;
      if(!this.verifyInputs())
        return;

      //add client
      this.sending = true;
      if(!this.userAdded) {
      ClientService.add(this.client)
              .then(async (res)=>{
                this.userAdded = true;
                this.currentClient = res.data.client;
               this.addVehicle();
              })
              .catch((err)=>{
                console.log(err);
                this.sending = false;
                this.fireError("Email or phone number already in use");
              })
      } else {
        this.addVehicle();
      }
    },
    addVehicle() {
      VehicleService.add(this.currentClient.id,this.vehicle)
              .then((res)=>{
                this.vehicle = res.data.vehicle;
                Swal.fire({
                  position: 'top-end',
                  background: "rgba(19,150,71,0.8)",
                  icon: "success",
                  iconColor: "white",
                  color: "white",
                  text: "Client added successfully",
                  timerProgressBar: true,
                  showConfirmButton: false,
                  timer: 1500
                });
                auth.actions.authenticate(this.currentClient.user.barCode)
                        .then(async (res)=>{
                          await auth.actions.setClientToken(res.data.access_token);
                          await auth.actions.setClientBarCode(this.currentClient.user.barCode);
                          router.push({name: "home"});
                        })
              })
              .catch((err)=>{
                this.sending = false;
                console.log(err);
                this.fireError("Licence plate already in use");
              })
    }
  },
  created() {
    VehicleService.getAllCarBrands()
            .then((res)=>{
              this.brands = res.data.brands;
              this.brands = Object.values(this.brands);
              this.loading = false;
            });
    this.client = {};
    this.client.firstName = "";
    this.client.lastName = "";
    this.client.phone = "";
    this.client.email = "";
    this.vehicle = {};
    this.vehicle.matricule = "";
    this.vehicle.brand = "";
    this.vehicle.model = "";
    this.vehicle.year = "";
    this.vehicle.fueltype = "";
    this.vehicle.mileage = "";
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
