<template>
  <div>
    <div class="spinner-container" style="margin-top: 200px" v-if="loading" >
      <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
    </div>
  <div v-else class="homePageContainer">
    <div class="side-bar">
      <router-link to="/main"><img src="../assets/images/Shell-Logo.png" width="174" height="98"></router-link>
      <div style="margin-top: 100px;display: flex;flex-direction: column;overflow-y: auto;max-height: 1500px">
        <div @click="selectedCategory = null, products = allProducts" class="category">
          <span class="category-icon"><i class="fas fa-cart-shopping"></i></span><br><br>
          All
        </div>
          <div @click="selectedCategory = category, products = category.products" v-for="category in categories" :key="category.id" class="category">
            <span class="category-icon"><i :class="category.icon"></i></span><br><br>
            {{category.label}}
          </div>
      </div>
    </div>
    <div style="display: flex;justify-content: center;width: 100%">
      <div style="width: 100%">
        <div style="margin-left: 120px;width: 100%">
        <span v-if="!showCart" @click="showCart = true" title="Shopping cart" style="margin-right: 70px;border-radius: 10px;margin-top: -60px;font-size: 40px;cursor: pointer;float: right" class="badge badge-warning"><i class="fas fa-cart-shopping"></i></span>
       <br>
        <h1 class="products-title">SHOP</h1>
        <h3 class="selected-category" v-if="selectedCategory">{{selectedCategory.label}}</h3>
        <h3 class="selected-category" v-else>All products</h3>
        </div>
        <div class="container products">
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-sm">
            <div @click="addToCart(product)" :style="{'cursor': product.products_station[0].stock > 0 && !product.inCart ? 'pointer': ''}" class="product">
            <div style="width: 231px;height: 243px">
            <img v-if="product.imageFile" width="231" height="243" :src="product.imageFile">
              <div v-else style="width: 60px;height: 60px" class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
            </div>
            {{product.label}}
            <div class="priceTage">{{product.products_station[0].price}}DT</div>
            <div v-if="product.products_station[0].stock == 0" class="badge-danger">OUT OF STOCK</div>
            <div style="cursor: pointer" v-else-if="!product.inCart" class="badge-warning">ADD TO CART</div>
            <div v-else class="badge-success">ADDED TO CART <span><i class="fas fa-check"></i></span></div>
          </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>

      <Transition>
      <shopping-cart @product-removed="resetProduct" @checkout="checkout" @close="showCart = false;" v-if="showCart"></shopping-cart>
      </Transition>

      <print-checkout-page v-if="printThis" @close="printThis = false" :purchase="purchase"></print-checkout-page>
  </div>
</template>
<script>


import ProductService from "../services/ProductService";
import Swal from "sweetalert2";
import ShoppingCart from "@/components/ShoppingCart.vue";
import PrintCheckoutPage from "@/components/PrintCheckoutPage.vue";

export default {
  name: 'ProductsPage',
    components: {PrintCheckoutPage, ShoppingCart},
  data() {
    return {
      purchase:null,
      printThis:false,
      showCart:false,
      loading:true,
      categories: [],
      allProducts:[],
      products: [],
      selectedCategory : null,
    }
  },
  methods: {
    resetProduct(product) {
      for(let i =0;i<this.allProducts.length;i++) {
          if(this.allProducts[i].id === product.id) {
              this.allProducts[i].inCart = false;
              break;
          }
      }
    },
    checkout(purchase) {
      this.purchase = purchase;
      this.printThis = true;
    },
    addToCart(product) {
        if(product.inCart || product.products_station[0].stock === 0) {
            return;
        }
        Swal.fire({
            title: "Add product to shopping cart",
            html:
                '<br><div><div>Available stock: <span class="badge badge-success">'+product.products_station[0].stock+'</span></div>' +
                '<br><br><div>Quantity</div><input id="quantityInput" type="number" min="1" max="'+product.products_station[0].stock+'" value="1" class="swal2-input"> </div>',
            showCancelButton: true,
            confirmButtonColor: '#139647',
            cancelButtonColor: '#d33',
        }).then((result)=> {
            if (result.isConfirmed) {
                const qnt = document.getElementById("quantityInput").value;
                if(isNaN(qnt) || qnt.length === 0 || qnt  < 1 || qnt > product.products_station[0].stock) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid quantity',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }
                product.cartQuantity = parseInt(qnt);
                product.inCart = true;
                if(!window.localStorage.getItem("cart")) {
                    window.localStorage.setItem("cart",'['+JSON.stringify(product)+']');
                } else {
                    let pdcts = JSON.parse(window.localStorage.getItem("cart"));
                    pdcts.push(product);
                    window.localStorage.setItem("cart",JSON.stringify(pdcts));
                }
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text: 'Product added to your cart',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    },
    showAllProducts() {
      this.selectedCategory = null;
      this.products = this.allProducts;
    },
    loadImage(id, k) {
      ProductService.getImageByProductId(id)
              .then((res)=>{
                this.allProducts[k].imageFile = res.data.image;
                return res.data.image;
              })
              .catch((err)=>{
                console.log(err);
                return null;
              })
    },
    async setAllProducts() {
        let cart = null;
      if(window.localStorage.getItem("cart"))
        cart =  JSON.parse(window.localStorage.getItem("cart"));
      this.allProducts = [];
      let k =0;
      for(let i = 0;i<this.categories.length;i++){
        if(this.categories[i].products.length) {
          for(let j=0;j<this.categories[i].products.length;j++) {
            this.categories[i].products[j].imageFile = this.loadImage(this.categories[i].products[j].id, k);
            this.allProducts.push(this.categories[i].products[j]);
            if(cart) {
                for(let k=0;k<cart.length;k++) {
                    if(cart[k].id === this.categories[i].products[j].id) {
                        this.categories[i].products[j].inCart = true;
                        break;
                    }
                }
            }
            k++;
          }
        }
      }
    }
    },
  created() {
    ProductService.findAllByStationId()
            .then(async (res)=>{
              this.categories = res.data.categories;
              await this.setAllProducts();
              await this.showAllProducts();
              this.loading = false;
            })
            .catch((err)=>{
              console.log(err);
            })
  }
}
</script>