import { createWebHistory, createRouter } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: {
            layout: 'AppLayoutHome'
        }
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About.vue'),
        meta: {
            layout: 'AppLayoutAbout'
        }
    },
]

const index = createRouter({
    history: createWebHistory(),
    routes,
});

export default index;