import { createRouter, createWebHashHistory } from 'vue-router';
import AuthGuard from './auth-guard';

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: AuthGuard,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/layouts/DashboardLayout'),
        children: [
          {
            path: '',
            name: 'Dashboard',
            component: () => import('@/views/Dashboard'),
          }
        ]
      },
      {
        path: 'tournaments',
        name: 'Tournaments',
        component: () => import('@/layouts/DefaultLayout'),
        children: [
          {
            path: '',
            name: 'Tournaments',
            component: () => import('@/views/tournaments/Tournaments'),
          },
          {
            path: ':id',
            name: 'TournamentsBracket',
            component: () => import('@/views/tournaments/TournamentsBracketView'),
            // component: () => import('@/components/tournaments/TournamentsBracket'),
          },
          {
            path: ':id/contest/:contestId',
            name: 'TournamentDetails',
            component: () => import('@/views/tournaments/TournamentDetails'),
          },
          {
            path: '/tournaments/calendar',
            name: 'TournamentsCalendar',
            component: () => import('@/views/tournaments/TournamentsCalendar'),
          },
        ]
      },
      {
        path: 'missions',
        name: 'Missions',
        component: () => import('@/layouts/DefaultLayout'),
        children: [
          {
            path: '',
            name: 'Missions',
            component: () => import('@/views/missions/Missions'),
          },
          {
            path: ':id',
            name: 'MissionsMap',
            component: () => import('@/views/missions/MissionsMapView'),
          },
          {
            path: 'details/:id',
            name: 'MissionDetails',
            component: () => import('@/views/missions/MissionDetails'),
          },
        ]
      },
      {
        path: 'achievements',
        name: 'Achievements',
        component: () => import('@/layouts/DefaultLayout'),
        children: [
          {
            path: '',
            name: 'Achievements',
            component: () => import('@/views/achievements/Achievements')
          },
          {
            path: 'details/:id',
            name: 'AchievementDetails',
            component: () => import('@/views/achievements/AchievementDetails'),
          },
        ]
      },
      {
        path: 'awards',
        name: 'Awards',
        component: () => import('@/layouts/DefaultLayout'),
        children: [
          {
            path: '',
            name: 'Awards',
            component: () => import('@/views/awards/Awards'),
          },
          {
            path: 'details/:id',
            name: 'AwardDetails',
            component: () => import('@/views/awards/AwardDetails'),
          },
          {
            path: '/awards/single-wheel',
            name: 'SingleWheel',
            component: () => import('@/views/awards/SingleWheel')
          },
          {
            path: '/awards/scratch-cards',
            name: 'Scratchcards',
            component: () => import('@/views/awards/Scratchcards')
          }
        ]
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/layouts/DefaultLayout'),
        children: [
          {
            path: '',
            name: 'Messages',
            component: () => import('@/views/messages/Messages'),
          },
          {
            path: 'details/:id',
            name: 'MessageDetails',
            component: () => import('@/views/messages/MessageDetails'),
          },
        ]

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