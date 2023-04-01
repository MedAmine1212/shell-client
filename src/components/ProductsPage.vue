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
      <div>
        <div style="margin-left: 120px">
        <h1 class="products-title">SHOP</h1>
        <h3 class="selected-category" v-if="selectedCategory">{{selectedCategory.label}}</h3>
        <h3 class="selected-category" v-else>All products</h3>
        </div>
        <div class="products">
          <div v-for="product in products" :key="product.id" class="product">
            <div style="width: 231px;height: 243px">
            <img v-if="product.imageFile" width="231" height="243" :src="product.imageFile">
              <div v-else style="width: 60px;height: 60px" class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
            </div>
            {{product.label}}
            <div class="priceTage">{{product.products_station[0].price}}DT</div>
            <div v-if="product.products_station[0].stock == 0" class="bagde badge-danger">OUT OF STOCK</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>


import ProductService from "../services/ProductService";

export default {
  name: 'ProductsPage',
  data() {
    return {
      loading:true,
      categories: [],
      allProducts:[],
      products: [],
      selectedCategory : null,
    }
  },
  methods: {
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
      this.allProducts = [];
      let k =0;
      for(let i = 0;i<this.categories.length;i++){
        if(this.categories[i].products.length) {
          for(let j=0;j<this.categories[i].products.length;j++) {
            this.categories[i].products[j].imageFile = this.loadImage(this.categories[i].products[j].id, k);
            this.allProducts.push(this.categories[i].products[j]);
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