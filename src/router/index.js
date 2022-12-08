import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/pages/Login'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/AppLayout'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard'),
      },
      {
        path: 'tournaments',
        name: 'Tournaments',
        component: () => import('@/views/tournaments/TournamentsView'),
        children: [
          {
            path: '',
            name: 'Tournaments',
            component: () => import('@/views/tournaments/Tournaments'),
          },
          {
            path: ':id',
            name: 'TournamentDetails',
            component: () => import('@/views/tournaments/TournamentDetails'),
          },
        ]
      },
      {
        path: 'missions',
        name: 'Missions',
        component: () => import('@/views/Missions'),
        // children: [
        //     {
        //         path: '',
        //         name: 'Missions',
        //         component: () => import('@/views/Missions'),
        //     },
        // {
        //     path: ':id',
        //     name: 'MissionDetails',
        //     component: () => import('@/views/MissionDetails'),
        // },
        // ]
      },
      {
        path: 'loyality-Level',
        name: 'LoyalityLevel',
        component: () => import('@/views/LoyalityLevel'),
      },
      {
        path: 'instant-rewards',
        name: 'InstantRewards',
        component: () => import('@/views/InstantRewards'),
      },
      {
        path: 'loyality-store',
        name: 'LoyalityStore',
        component: () => import('@/views/LoyalityStore'),
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/Messages'),
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: () => import('@/views/Calendar'),
      },
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/History'),
      },
    ]
  },
];

const isAuthenticated = localStorage.getItem('token');

const router = createRouter({
                              history: createWebHistory(),
                              routes,
                            });

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' });
  else next();
});


export default router;