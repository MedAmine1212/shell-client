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
        <h1 class="products-title">DONE WORK</h1><br>
          <div style="max-height: 1300px;overflow-y: auto">
        <table class="table" style="width: 100%">
          <thead>
          <th style="width: 40%"></th>
          <th style="width: 20%"><div class="diagnostic-th">AMOUNT</div></th>
          <th style="width: 20%"><div class="diagnostic-th">PIECE(S)</div></th>
            <th style="width: 20%"><div class="diagnostic-th">WORKFORCE</div></th>
          </thead>
          <tbody>
          <tr style="border-bottom: 1px solid #FFEF00" v-for="service in services" :key="service.service_id">
            <td style="width: 40%" class="service-label">{{service.service.label}}</td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><input class="form-control" style="text-align: center;color: black;font-size: 22px;height: 40px;width: 80%;border:none" v-model="service.price"/><span v-if="service.price" style="margin-left: 6px;margin-top: 5px">DT</span></div></td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><div @click="setPrice(service,'' ,'pieces')" class="diagnostic-checkbox" :class="{'diagnostic-checked': service.piecePrice != 0 && service.piecePrice}"></div></div></td>
            <td style="width: 20%"><div class="diagnostic-th diagnostic-td"><div @click="setPrice(service, 'workforce')" class="diagnostic-checkbox" :class="{'diagnostic-checked': service.workforcePrice != 0 && service.workforcePrice}"></div></div></td>
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
  name: 'MaintenancePage',

  components: {
    PrintConsultationPage,
  },
  data() {
    return {
        loading:true,
        sending:false,
        services: [],
        selectedServices: [],
        printThis:false,
        message: "",
        consultation:null,
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
            ConsultationService.create("maintenance")
                .then((res)=> {
                    this.consultation = res.data.consultation;
                    this.consultation.consultation_service = [];
                    window.localStorage.setItem("maintenance", JSON.stringify(this.consultation));
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
                window.localStorage.setItem("maintenance", JSON.stringify(this.consultation));
                this.sending = false;
                this.printThis = true;
              })
              .catch((err)=>{
                console.log(err);
              })
    },
    fireError() {
      Swal.fire({
        position: 'top-end',
        background: "rgb(252, 226,74)",
        icon: "error",
        iconColor: "red",
        color: "red",
        text: 'Invalid price',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 1500
      });
    },
    setPrice(service,status, sender) {
      if(sender === 'pieces') {
        if(service.piecePrice > 0) {
          service.piecePrice = 0;
          this.setSelected(service);
        }
        else {
          Swal.fire({
            title: "Piece(s) price",
            html: '<br><div><div>Price (DT)</div><input style="text-align: center" id="pieces-input" class="swal2-input"></div>',
            showCancelButton: true,
            cancelButtonColor:"#FF141E",
            confirmButtonColor:"#FFEF00",
          }).then((result)=> {
            if (result.isConfirmed) {
              if (isNaN(document.getElementById('pieces-input').value) || document.getElementById('pieces-input').value.length === 0 || document.getElementById('pieces-input').value == 0) {
                this.fireError();
                return;
              }
              service.piecePrice = parseFloat(document.getElementById('pieces-input').value);
              service.price = service.workforcePrice+service.piecePrice;
              this.setSelected(service);
            }
          });
        }
      } else {
        if(service.workforcePrice > 0) {
          service.workforcePrice = 0;
          this.setSelected(service);
        }
        else {
          Swal.fire({
            title: "Workforce price",
            html: '<br><div><div>Price (DT)</div><input id="workforce-input" style="text-align: center" class="swal2-input"></div>',
            showCancelButton: true,
            cancelButtonColor:"#FF141E",
            confirmButtonColor:"#FFEF00",
          }).then((result)=> {
            if (result.isConfirmed) {
              if (isNaN(document.getElementById('workforce-input').value) || document.getElementById('workforce-input').value.length === 0 || document.getElementById('workforce-input').value == 0) {
                this.fireError();
                return;
              }
              service.workforcePrice = parseFloat(document.getElementById('workforce-input').value);
              service.price = service.workforcePrice+service.piecePrice;
              this.setSelected(service);
            }
          });
        }
      }
      service.price = service.workforcePrice + service.piecePrice;
      if(service.price === 0)
        service.price = null;
    },
    setSelected(service) {
        console.log(service);
        console.log(this.selectedServices);
      if(service.piecePrice === 0 && service.workforcePrice === 0) {
        for(let i =0;i< this.selectedServices.length;i++) {
          if(this.selectedServices[i].service_id === service.service_id) {
            this.selectedServices.splice(i,1);
            break;
          }
        }
      } else if(service.piecePrice > 0 || service.workforcePrice > 0) {
        let add = true;
        for(let i =0;i< this.selectedServices.length;i++) {
          if(this.selectedServices[i].service_id === service.service_id) {
            add = false;
            break;
          }
        }
        if(add)
          this.selectedServices.push(service);
      }
    }
    },
  created() {
    ServiceService.findAllByStationId()
            .then((res)=>{
              this.services = res.data.services;
              this.services.forEach((service)=> {service.piecePrice = 0; service.workforcePrice = 0});
              if(window.localStorage.getItem("maintenance")) {
                this.consultation = JSON.parse(window.localStorage.getItem("maintenance"));
                if(this.consultation.consultation_service.length) {
                  this.selectedServices = [];
                  for(let i=0;i<this.consultation.consultation_service.length;i++) {
                    this.selectedServices.push(this.consultation.consultation_service[i]);
                    for(let j=0;j<this.services.length;j++) {
                      if(this.services[j].service_id === this.consultation.consultation_service[i].service_id) {
                        this.services[j].price = this.consultation.consultation_service[i].price;
                        this.services[j].workforcePrice = this.consultation.consultation_service[i].workforcePrice;
                        this.services[j].piecePrice =this.consultation.consultation_service[i].piecePrice;
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