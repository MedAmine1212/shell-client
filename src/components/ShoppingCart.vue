<template>
<div class="cart-main">
    <div class="cart-container">
        <div class="cart-header">
            <h3 class="cart-heading">Shopping Cart
                <span @click="close()" title="close" style="color:#E44C4C ;height: 40px;width:40px;font-size: 25px;border-radius: 300px;cursor: pointer;margin-left: 10px;display: flex;justify-content: center;align-items: center;">
                    <i class="fas fa-circle-xmark"></i>
                </span>
            </h3>
            <button :disabled="sending" @click="removeAll()" v-if="!loading && products.length" class="cart-action">Empty cart</button>
        </div>
        <div class="spinner-container" style="margin-top: 100px;width: 100%" v-if="loading" >
            <div class="spinner-grow text-warning spinner" style="width: 60px;height: 60px" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div style="width: 100%" v-else>
        <div v-if="products.length" style="width: 100%">
        <div class="cart-checkout">
            <div style="width: 28%;float: right;margin-right: 5%">
                <div class="cart-total">
                    <div>
                        <div class="cart-subtotal">Total amount</div>
                        <div class="cart-items-count">{{products.length}} items</div>
                    </div>
                    <div class="cart-total-amount">{{totalAmount}}DT</div>
                </div>
                <button :disabled="sending" @click="checkout()" class="btn btn-success cart-button">
                    <span v-if="!sending">Checkout</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
            </div>
        </div>
        <hr class="cart-hr">
        <div class="cart-items-container">
            <div v-for="product in products" :key="product.id" class="cart-items">
                <div class="cart-image-box">
                    <img :src="product.imageFile" width="100" height="100"/>
                </div>
                <div class="cart-about">
                    <h1 class="cart-title">{{ product.label }}</h1>
                    <h3 class="cart-subtitle">{{ product.description }}</h3>
                </div>
                <div class="cart-counter">
                    <div @click="addQuantity(product)" :class="{'badge-success': product.cartQuantity < product.products_station[0].stock, 'cart-btn-disabled': product.cartQuantity === product.products_station[0].stock || sending}" class="badge cart-btn">+</div>
                    <div class="badge cart-count">{{ product.cartQuantity }}</div>
                    <div @click="removeQuantity(product)" :class="{'badge-warning': product.cartQuantity > 1, 'badge-danger': product.cartQuantity === 1, 'cart-btn-disabled': sending}" class="badge  cart-btn">-</div>
                </div>
                <div class="cart-prices">
                    <div class="cart-amount">{{product.products_station[0].price }}DT</div>
                    <button :disabled="sending" @click="removeProduct(product)" class="cart-remove"><u>Remove</u></button>
                </div>
            </div>
        </div>
        </div>
        <div class="spinner-container" style="margin-top: 100px;width: 100%;font-size: 30px" v-else>
            No products in your cart
        </div>
        </div>
    </div>

</div>
</template>

<script>
import Swal from "sweetalert2";
import productService from "@/services/ProductService";

export default {
    name: 'ShoppingCart',
    data() {
        return {
            sending:false,
            totalAmount:0,
            loading:true,
            products:[],
        }
    },
    methods: {
        removeAll() {
            Swal.fire({
                title: 'Alert',
                text: 'Empty shopping cart ?',
                showCancelButton: true,
                confirmButtonColor: '#139647',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.removeItem("cart");
                    this.products.forEach((p)=>{
                        this.$emit("product-removed", p);
                    })
                    this.totalAmount = 0;
                    this.products = [];
                }
            });
        },
        close() {
            if(this.sending)
                return;
            this.products = [];
            this.loading = true;
            this.totalAmount = 0;
            this.$emit("close");
        },
        addQuantity(product) {
            if (this.sending)
                return;
          if(product.cartQuantity === product.products_station[0].stock) {
              return;
          }
            product.cartQuantity++;
            this.totalAmount+=product.products_station[0].price;
            window.localStorage.setItem("cart", JSON.stringify(this.products));
        },
        removeProduct(product) {
            Swal.fire({
                title: 'Alert',
                text: 'Remove product from shopping cart ?',
                showCancelButton: true,
                confirmButtonColor: '#139647',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.products.splice(this.products.indexOf(product),1);
                    this.$emit("product-removed", product);
                    this.totalAmount-=(product.products_station[0].price*product.cartQuantity);
                    window.localStorage.setItem("cart", JSON.stringify(this.products));
                }
            });
        },
        removeQuantity(product) {
            if (this.sending)
                return;
            if(product.cartQuantity === 1) {
             this.removeProduct(product);
            }
            else {
                product.cartQuantity--;
                this.totalAmount-=product.products_station[0].price;
                window.localStorage.setItem("cart", JSON.stringify(this.products));
            }
        },
        checkout() {
            if(this.sending)
                return;
            this.sending = true;
            const prods = [];
            this.products.forEach((product)=>{
                const p = {...product};
                p.products_station = {...p.products_station};
                p.imageFile = null;
                prods.push(p);
            })
            productService.checkout(prods)
                .then((res)=>{
                    this.sending = false;
                    this.printThis = true;
                    this.$emit("checkout",res.data.purchase);
                    window.localStorage.removeItem("cart");
                    this.products.forEach((p)=>{
                        this.$emit("product-removed", p);
                    })
                    this.close();
                })
                .catch(err=>{
                    console.log(err);
                })
        }
    },
    created() {
        if(window.localStorage.getItem("cart")) {
            this.products = JSON.parse(window.localStorage.getItem("cart"));
            this.products.forEach(p=>{
                this.totalAmount+=(p.products_station[0].price*p.cartQuantity);
            });
            this.loading = false;
        }
        else
            this.loading = false;
    }
}
</script>