import { createWebHistory, createRouter } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
    },
    {
        path: '/tournaments',
        name: 'Tournaments',
        component: () => import('@/views/Tournaments.vue'),
        // children: [
        //     {
        //         path: '/details',
        //         name: 'TournamentDetails',
        //         component: () => import('@/views/TournamentDetails.vue'),
        //     },
        // ]
    },
    {
        path: '/tournaments/details',
        name: 'TournamentDetails',
        component: () => import('@/views/TournamentDetails.vue'),
    },
    {
        path: '/missions',
        name: 'Missions',
        component: () => import('@/views/Missions.vue'),
    },
    {
        path: '/loyality-Level',
        name: 'LoyalityLevel',
        component: () => import('@/views/LoyalityLevel.vue'),
    },
    {
        path: '/instant-rewards',
        name: 'InstantRewards',
        component: () => import('@/views/InstantRewards.vue'),
    },
    {
        path: '/loyality-store',
        name: 'LoyalityStore',
        component: () => import('@/views/LoyalityStore.vue'),
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/views/Messages.vue'),
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('@/views/History.vue'),
    },
]

const index = createRouter({
    history: createWebHistory(),
    routes,
});

export default index;