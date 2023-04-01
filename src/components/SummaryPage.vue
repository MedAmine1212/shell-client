<template>
  <div class="homePageContainer">
    <!--header-->
    <div class="mini-advertisement">
      <img src="../assets/images/Header.png" style="width: 100%">
    </div>
    <!--main-->
    <div style="margin-top: 150px">
      <div class="spinner-container" v-if="loading" >
        <div class="spinner-grow text-danger spinner" style="width: 120px;height: 120px" role="status"><span class="sr-only">Loading...</span></div>
      </div>
      <div style="width: 100%;text-align: center" v-else>
        <div v-if="lastConsultation">
        <h1 class="summary-title">welcome dear customer</h1>
        <div class="user-info">
          <span>{{lastConsultation.vehicle.client.user.firstName}} {{lastConsultation.vehicle.client.user.lastName}}</span><br>
          <span>{{lastConsultation.vehicle.brand}} {{lastConsultation.vehicle.model}}</span><br>
          <span>{{lastConsultation.vehicle.matricule}}</span>
          <div style="margin-top: 150px;justify-content: center;text-align: left">
          <h1 class="consultation-title">
            Your last consultation has been done by <b>{{lastConsultation.employee.user.firstName}} {{lastConsultation.employee.user.lastName}}</b> on <b>{{lastConsultation.dateConsultation}}</b>
          </h1>
            <h1 style="margin-top: -30px" class="consultation-title">
              Work done:
            </h1>
            <div style="max-height: 800px;overflow-y: auto;min-height: 800px">
            <ul>
              <li v-for="service in lastConsultation.consultation_service" :key="service.servive_id" class="service-list-item">{{service.service.label}}</li>
            </ul>
            </div>
          </div>
        </div>
        </div>
        <div class="user-info" style="margin-top: 550px;height: 800px" v-else>
          There is no consultation<br> history to show
        </div>
        <div class="buttons">
          <router-link to="/main/home"><button class="btn cancelBtn"><span style="margin-right: 20px"><i class="far fa-circle-xmark"></i></span>CLOSE</button></router-link>
          <button @click="printTicket()" v-if="lastConsultation" style="margin-left: 30px" class="btn printBtn"><span style="margin-right: 20px"><i class="fas fa-print"></i></span>PRINT TICKET</button>
        </div>
      </div>
    </div>

    <!--To print-->
    <span id="consultationContainer" style="display: none"  v-if="!loading">
    <div style="width: 100%;display: flex;justify-content: center">
      <div style="width: 900px;font-size:50px !important;font-family: 'Calibri',sans-serif !important">
        <div style="width: 100%;display: flex;justify-content: center">
      <img src="../assets/images/Shell-Logo.png" width="360"/>
          </div><br>
        <hr>
        <div style="text-align: left !important;width: 100%;">
          <div style="width: 100%"><span><b>Client</b></span> <span style="text-align: right;float:right !important;">{{lastConsultation.vehicle.client.user.firstName}} {{lastConsultation.vehicle.client.user.firstName}}</span></div>
          <div style="width: 100%"><span><b>Vehicle</b></span> <span style="text-align: right;float:right !important;"><span>{{lastConsultation.vehicle.brand}} {{lastConsultation.vehicle.model}}</span></span></div>
          <div style="width: 100%"><span><b>Licence plate</b></span> <span style="text-align: right;float:right !important;">{{lastConsultation.vehicle.matricule}}</span></div>
        </div>
        <div style="text-align: left !important;width: 100%">
          <div style="width: 100%"><span><b>Consultation date</b></span><span style="text-align: right;float:right !important;">{{lastConsultation.dateConsultation}}</span></div>
          <div style="width: 100%"><span><b>Technician</b></span><span style="text-align: right;float:right !important;">{{lastConsultation.employee.user.firstName}} {{lastConsultation.employee.user.lastName}}</span></div>
        </div>
        <div><br>
        <h1 style="text-align: left !important;width: 100%"><b>Services:</b></h1>
          <div style="text-align: left !important;width: 100%">
            <div v-for="service in lastConsultation.consultation_service" :key="service.service_id" style="font-size: 40px;width: 100%"><span><b>{{service.service.label}}</b></span> <span style="text-align: right;float:right !important;"><b>{{service.service.station_services[0].piece_price+service.service.station_services[0].workforce_price}} DT</b></span></div>
           </div><br>
          <div style="text-align: left !important;width: 100%">
            <div style="width: 100%"><span><b>Total</b></span><span style="text-align: right;float:right !important;" ><b>{{lastConsultation.price}} DT</b></span></div>
            <div style="width: 100%"><span><b>Discount</b></span><span style="text-align: right;float:right !important;" v-if="lastConsultation.discount != null"><b>{{lastConsultation.discount}} DT</b></span><span style="text-align: right;float:right !important;" class="badge badge-warning" v-else><b>No discount</b></span></div>
          </div><br>
          <div style="text-align: left !important;width: 100%">
            <div style="width: 100%"><span><b>Total after discount</b></span><span style="text-align: right;float:right !important;"><b>{{lastConsultation.price - lastConsultation.discount}} DT</b></span></div>
          </div><br>
           <div style="width: 100%;font-weight: bolder;text-align: center;font-size: 45px;font-family: 'Calibri',sans-serif !important">
        POWERED BY LIBERREX
        </div>
          <hr style="border: 1px solid black">
        </div>
      </div>
    </div>
</span>
    <!--End print-->
  </div>
</template>
<script>

import ConsultationService from "../services/ConsultationService";

export default {
  name: 'SummaryPage',
  data() {
    return {
      loading:true,
      lastConsultation:null
    }
  },
  methods: {
    async printTicket() {
      await this.$htmlToPaper('consultationContainer');
      },
    },
  created() {
    ConsultationService.clientLastConsultation()
            .then((res)=>{
              this.lastConsultation = res.data.consultation;
              console.log(this.lastConsultation);
              this.loading = false;
            })
            .catch((err)=>{
              console.log(err);
              this.loading = false;
            })
  }
}
</script>