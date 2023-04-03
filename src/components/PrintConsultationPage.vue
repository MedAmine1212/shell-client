<template>
  <div class="homePageContainer">
    <!--To print-->
    <span id="consultationContainer" style="display: block">
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
          <div style="width: 100%"><span><b>Consultation type</b></span><span style="text-align: right;float:right !important;">
            <span v-if="lastConsultation.type=== 'maintenance'">MAINTENANCE</span>
            <span v-else>DIAGNOSTIC</span>
          </span></div>
          <div style="width: 100%"><span><b>Technician</b></span><span style="text-align: right;float:right !important;">{{lastConsultation.employee.user.firstName}} {{lastConsultation.employee.user.lastName}}</span></div>
        </div>
        <div><br>
        <h1 style="text-align: left !important;width: 100%"><b>Services:</b></h1>
          <div style="text-align: left !important;width: 100%">
            <div v-for="service in lastConsultation.consultation_service" :key="service.service_id" style="font-size: 40px;width: 100%"><span><b>{{service.service.label}}</b></span>
              <span v-if="lastConsultation.type=== 'maintenance'" style="text-align: right;float:right !important;"><b>{{service.price}} DT</b></span>
              <span v-else style="text-align: right;float:right !important;"><b>{{service.status}}</b></span>
            </div>
           </div><br>
          <div style="text-align: left !important;width: 100%">
            <div style="width: 100%">
              <span v-if="lastConsultation.type=== 'maintenance'"><b>Total</b></span>
              <span v-else><b>Price</b></span>
              <span style="text-align: right;float:right !important;" ><b>{{lastConsultation.price}} DT</b></span></div>
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


export default {
  name: 'PrintConsultationPage',
  props: {
    lastConsultation: Object,
  },
  methods: {
    async printTicket() {
      await this.$htmlToPaper('consultationContainer');
      this.$emit("close");
      },
    },
  mounted() {
    this.printTicket();
  }
}
</script>