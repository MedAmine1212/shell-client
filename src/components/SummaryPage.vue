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
          <button @click="printThis = true" v-if="lastConsultation" style="margin-left: 30px" class="btn printBtn"><span style="margin-right: 20px"><i class="fas fa-print"></i></span>PRINT TICKET</button>
        </div>
      </div>
    </div>

    <!--To print-->
    <print-consultation-page v-if="printThis" @close="printThis = false" :lastConsultation="lastConsultation"></print-consultation-page>
    <!--End print-->
  </div>
</template>
<script>

import ConsultationService from "../services/ConsultationService";
import PrintConsultationPage from "./PrintConsultationPage";
export default {
  name: 'SummaryPage',
  components: {
    PrintConsultationPage,
  },
  data() {
    return {
      loading:true,
      printThis:false,
      lastConsultation:null
    }
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