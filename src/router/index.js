import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from "@/components/WelcomePage"
import auth from './../services/auth.js'
import LoginPage from "@/components/LoginPage"
import BorneInitiation from "@/components/BorneInitiation";
import BorneService from "@/services/BorneService";
import MainVue from "@/components/MainVue";
import HomePage from "@/components/HomePage";
import NewClient from "@/components/NewClient";
import SummaryPage from "@/components/SummaryPage";
import ProductsPage from "@/components/ProductsPage";
import DiagnosticsPage from "@/components/DiagnosticsPage";

const routes = [
    {
        path: '/',
        redirect: "/main",
        name: ''
    },
    {
        path: '/initiateBorne',
        name: 'initiateBorne',
        component:BorneInitiation,
    },
    {
        path: "/main",
        name:"main",
        component: MainVue,
        redirect:"/main/welcome",
        children:[
            {
                path: 'welcome',
                name: "welcome",
                components: {
                    default: MainVue,
                    second: WelcomePage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'shop',
                name: "shop",
                components: {
                    default: MainVue,
                    second: ProductsPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'diagnostics',
                name: "diagnostics",
                components: {
                    default: MainVue,
                    second: DiagnosticsPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'maintenance',
                name: "maintenance",
                components: {
                    default: MainVue,
                    second: DiagnosticsPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'summary',
                name: "summary",
                components: {
                    default: MainVue,
                    second: SummaryPage
                }
            },
            {
                path: 'newClient',
                name: "newClient",
                components: {
                    default: MainVue,
                    second:NewClient
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'home',
                name: "home",
                components: {
                    default: MainVue,
                    second: HomePage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
            {
                path: 'login',
                name: "login",
                components: {
                    default: MainVue,
                    second: LoginPage
                }
                // component: ()=>
                //     import('view/view.vue') //lazy loading
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
router.beforeEach((to, from, next)=>{
    if(BorneService.getBorneId() == null) {
        if(to.name !== "initiateBorne")
            next({ name: 'initiateBorne' });
    } else {
        if (to.name === 'summary') {
            //Client not authenticated
            if (auth.actions.getCLientToken() == null)
                if (to.name !== "login")
                    next({name: 'login'});
        } else if (to.name === 'diagnostics' || to.name === 'maintenance') {
            if (auth.actions.getCLientToken() == null || auth.actions.getEmployeeToken() == null)
                if (to.name !== "login")
                    next({name: 'login'});
        } else if (to.name === 'login' || to.name === "welcome" || to.name === "newClient") {
            if(auth.actions.getCLientToken() != null && auth.actions.getEmployeeToken()) {
                if (to.name !== "home")
                    next({name: 'home'});
            } else {
                auth.actions.removeEmployeeToken();
            }
        }
    }
    next();
});

export default router