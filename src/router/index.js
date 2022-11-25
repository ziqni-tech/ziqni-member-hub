import { createWebHistory, createRouter } from "vue-router";


const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard'),
    },
    {
        path: '/tournaments',
        name: 'Tournaments',
        component: () => import('@/views/Tournaments'),
        // children: [
        //     {
        //         path: '/tournaments/details/:id',
        //         name: 'TournamentDetails',
        //         component: () => import('@/views/TournamentDetails'),
        //     },
        // ]
    },
    {
        path: '/tournaments/details/:id',
        name: 'TournamentDetails',
        component: () => import('@/views/TournamentDetails'),
        // component: () => import('@/views/MissionDetails'),
    },
    {
        path: '/missions',
        name: 'Missions',
        component: () => import('@/views/Missions'),
    },
    // {
    //     path: '/missions/details/:id',
    //     name: 'MissionDetails',
    //     component: () => import('@/views/MissionDetails'),
    // },
    {
        path: '/loyality-Level',
        name: 'LoyalityLevel',
        component: () => import('@/views/LoyalityLevel'),
    },
    {
        path: '/instant-rewards',
        name: 'InstantRewards',
        component: () => import('@/views/InstantRewards'),
    },
    {
        path: '/loyality-store',
        name: 'LoyalityStore',
        component: () => import('@/views/LoyalityStore'),
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/views/Messages'),
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('@/views/History'),
    },
]

const index = createRouter({
    history: createWebHistory(),
    routes,
});

export default index;