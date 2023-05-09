import { createRouter, createWebHashHistory } from 'vue-router';
import AuthGuard from './auth-guard';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layouts/AppLayout'),
    beforeEnter: AuthGuard,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard'),
      },
      {
        path: 'tournaments',
        name: 'Tournaments',
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
        children: [
          {
            path: '',
            name: 'Missions',
            component: () => import('@/views/missions/Missions'),
          },
          {
            path: ':id',
            name: 'MissionDetails',
            component: () => import('@/views/missions/MissionDetails'),
          },
        ]
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: () => import('@/views/Achievements'),
      },
      {
        path: 'awards',
        name: 'Awards',
        component: () => import('@/views/Awards'),
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/Messages'),
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/pages/Login'),
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/pages/Page404')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;