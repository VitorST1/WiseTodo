import { createRouter, createWebHashHistory } from "vue-router"
import AppHome from "../views/AppHome.vue"
import AppLogin from "../views/AppLogin.vue"
import NotFound from "../views/NotFound.vue"
import { userStore as uStore } from "../stores/userStore"

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
    const userStore = uStore()
    
    if (to.meta.requiresAuth && !userStore.user.loggedIn) {
        return { name: "Login" }
    }
})

export default router