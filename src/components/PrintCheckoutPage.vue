<template>
  <div v-if="purchase" style="background: white" class="homePageContainer">
    <!--To print-->
    <span id="purchaseContainer" style="display: block">
          <div style="position: absolute">
          <vue-qrcode style="display: none" id="qrcode" :value="purchase.id" :options="{ width: 250}"></vue-qrcode>
      <img src="" id="qrCodeImage" width="250"/>
          </div>
    <div style="width: 100%;display: flex;justify-content: center">
      <div style="width: 900px;font-size:50px !important;font-family: 'Calibri',sans-serif !important">

        <div style="width: 100%;display: flex;justify-content: center">
      <img src="../assets/images/Shell-Logo.png" width="360"/>

          </div><br>
        <hr>
        <div style="text-align: left !important;width: 100%;">
          <div style="width: 100%"><span><b>Client</b></span> <span style="text-align: right;float:right !important;">{{purchase.client.user.firstName}} {{purchase.client.user.lastName}}</span></div>
          <div style="width: 100%"><span><b>Purchase ID</b></span> <span style="text-align: right;float:right !important;"><span>{{purchase.id}}</span></span></div>
         </div>
        <div style="text-align: left !important;width: 100%">
          <div style="width: 100%"><span><b>purchase date</b></span><span style="text-align: right;float:right !important;">{{purchase.purchaseDate}}</span></div>
        </div>
        <div><br>
        <h1 style="text-align: left !important;width: 100%"><b>Products:</b></h1>
          <div style="text-align: left !important;width: 100%">
            <div v-for="purchaseProduct in purchase.purchase_products" :key="purchaseProduct.id" style="font-size: 40px;width: 100%">
                <span><b>{{purchaseProduct.product.label}} (x{{purchaseProduct.product.cartQuantity}})</b></span>
              <span style="text-align: right;float:right !important;"><b>{{purchaseProduct.product.products_station[0].price*purchaseProduct.product.cartQuantity}} DT</b></span>
            </div>
           </div><br>
          <div style="text-align: left !important;width: 100%">
            <div style="width: 100%">
              <span><b>Total</b></span>
              <span style="text-align: right;float:right !important;" ><b>{{purchase.price}} DT</b></span></div>
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

import VueQrcode from "@chenfengyuan/vue-qrcode";

export default {
  name: 'PrintCheckoutPage',
    components: {
        VueQrcode,
    },
  props: {
    purchase: Object,
  },
  methods: {
    async printTicket() {
      await this.$htmlToPaper('purchaseContainer');
      this.$emit("close");
      },
    },
  mounted() {
      const canvas = document.getElementById('qrcode');
      document.getElementById('qrCodeImage').src = canvas.toDataURL('image/png')
      this.printTicket();
  }
}
</script>