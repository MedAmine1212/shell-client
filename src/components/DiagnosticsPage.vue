<template>
  <div class="homePageContainer">
      <div v-if="sending" style="top:0;left:0;display: flex;justify-content:center;z-index:9999;position: absolute;width: 100%;height: 100%; background-color: rgba(255,255,255,0.5)">
          <div style="margin-top: 80%;margin-left: 20px">
              <div class="spinner-grow text-bg-warning" style="height: 120px;width: 120px" role="status"><span class="sr-only">Sending...</span></div><br>
              <span style="margin-left: -20px;font-size: 45px">{{message}}</span>
          </div>
      </div>
    <!--header-->
    <div class="mini-advertisement">
      <img src="../assets/images/Header.png">
    </div>
    <!--main-->
    <div style="margin-top: 150px">
      <div class="spinner-container" v-if="loading" >
        <div class="spinner-grow text-danger spinner" style="width: 120px;height: 120px" role="status"><span class="sr-only">Loading...</span></div>
      </div>
      <!--Content-->
      <div style="width: 100%;text-align: center" v-else>
        <h1 class="products-title">DIAGNOSTIC</h1><br>
          <div style="max-height: 1300px;overflow-y: auto">
        <table class="table" style="width: 100%">
          <thead>
          <th style="width: 40%"></th>
          <th style="width: 20%"><div class="diagnostic-th">GOOD</div></th>
          <th style="width: 20%"><div class="diagnostic-th">AVERAGE</div></th>
          <th style="width: 20%"><div class="diagnostic-th">BAD</div></th>
          </thead>
          <tbody>
          <tr style="border-bottom: 1px solid #FFEF00" v-for="service in services" :key="service.service_id">
            <td style="width: 40%" class="service-label">{{service.service.label}}</td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><div @click="setStatus(service, 'GOOD')"  class="diagnostic-checkbox" :class="{'diagnostic-checked': service.status === 'GOOD'}"></div></div></td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><div @click="setStatus(service, 'AVERAGE')" class="diagnostic-checkbox" :class="{'diagnostic-checked': service.status === 'AVERAGE'}"></div></div></td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><div @click="setStatus(service, 'BAD')" class="diagnostic-checkbox" :class="{'diagnostic-checked': service.status === 'BAD'}"></div></div></td>
          </tr>
          </tbody>
        </table>
          </div>
        <div class="buttons">
          <router-link to="/main/home"><button class="btn cancelBtn"><span style="margin-right: 20px"><i class="far fa-circle-xmark"></i></span>CANCEL</button></router-link>
          <button @click="saveConsultation()" style="margin-left: 30px" class="btn printBtn"><span style="margin-right: 20px"><i class="fas fa-print"></i></span>PRINT TICKET</button>
        </div>
      </div>
    </div>
    <!--To print-->
    <print-consultation-page v-if="printThis" @close="printThis = false" :lastConsultation="consultation"></print-consultation-page>
    <!--End print-->
  </div>
</template>
<script>

import ServiceService from "../services/ServiceService";
import PrintConsultationPage from "./PrintConsultationPage";
import ConsultationService from "../services/ConsultationService";
import Swal from 'sweetalert2'
import ConsultationServiceService from "../services/ConsultationServiceService";
export default {
  name: 'DiagnosticsPage',

  components: {
    PrintConsultationPage,
  },
  data() {
    return {
        loading:true,
        sending:false,
        services: [],
        printThis:false,
        message: "",
        consultation:null,
        selectedServices: [],
    }
  },
  methods: {
      saveConsultation() {
        if(this.selectedServices.length === 0) {
          Swal.fire({
            position: 'top-end',
            background: "rgb(252, 226,74)",
            icon: "warning",
            iconColor: "red",
            color: "red",
            text: 'You need to select at least 1 service',
            timerProgressBar: true,
            showConfirmButton: false,
            timer: 1500
          });
          return;
        }
        if(!this.consultation) {
            this.message = "Creating consultation...";
            this.sending = true;
            ConsultationService.create("diagnostic")
                .then((res)=>{
                    this.consultation = res.data.consultation;
                    this.consultation.consultation_service = [];
                    window.localStorage.setItem("consultation", JSON.stringify(this.consultation));
                    this.addServices();
                })
                .catch((err)=>{this.sending = false; console.log(err)})
        } else {
          this.addServices();
        }
      },
    addServices() {
      this.message = "Adding selected services...";
      this.sending = true;
      ConsultationServiceService.addServicesToConsultation(this.selectedServices, this.consultation.id)
              .then((res)=>{
                this.consultation = res.data.consultation;
                window.localStorage.setItem("consultation", JSON.stringify(this.consultation));
                this.sending = false;
                this.printThis = true;
              })
              .catch((err)=>{
                console.log(err);
              })
    },

    setStatus(service,status) {
      if(service.status === status) {
        if(this.selectedServices.indexOf(service) > -1) {
          this.selectedServices.splice(this.selectedServices.indexOf(service),1);
        }
        service.status = null;

      } else {
        if(this.selectedServices.indexOf(service) > -1)
          this.selectedServices[this.selectedServices.indexOf(service)].status = status;
        else
        this.selectedServices.push(service);
        service.status = status;
      }
    }
    },
  created() {
    ServiceService.findAllByStationId()
            .then((res)=>{
              this.services = res.data.services;
              if(window.localStorage.getItem("consultation")) {
                this.consultation = JSON.parse(window.localStorage.getItem("consultation"));
                if(this.consultation.consultation_service.length) {
                  this.selectedServices = [];
                  for(let i=0;i<this.consultation.consultation_service.length;i++) {
                    this.selectedServices.push(this.consultation.consultation_service[i]);
                    for(let j=0;j<this.services.length;j++) {
                        if(this.services[j].service_id === this.consultation.consultation_service[i].service_id) {
                          this.services[i].status = this.selectedServices[j].status;
                          break;
                      }
                    }
                  }
                }
              }

              this.loading=false
            })
            .catch((err)=>{
              console.log(err);
              this.loading = false;
            });
  }
}
</script>