import { createRouter, createWebHashHistory } from "vue-router"
import AppHome from "../views/AppHome.vue"
import AppLogin from "../views/AppLogin.vue"
import NotFound from "../views/NotFound.vue"

const routes = [
    { 
        path: "/", 
        name: "Home", 
        component: AppHome, 
        props: true,
        meta: {
            requiresAuth: true 
        }
    },
    { 
        path: "/login", 
        name: "Login", 
        component: AppLogin, 
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        // always scroll to top
        return { top: 0 }
    },
})

router.beforeEach((to) => {
    // if(to.meta.requiresAuth && !store.state.isAuthenticated) {
    if (to.meta.requiresAuth) {
        return { name: "Login" }
    }
})

export default router