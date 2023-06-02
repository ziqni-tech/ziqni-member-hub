import { createStore } from 'vuex';
import auth from './modules/authModule';
import apiClient from './modules/apiClientModule';
import memberData from './modules/memberModule';
import tournaments from './modules/tournamentsModule';
import notifications from './modules/notificationModule';
import leaderboard from './modules/leaderboardModule';
import currentMissions from './modules/missions/currentMissions';
import featureMissions from './modules/missions/featureMissions';
import theme from './modules/themeModule';
import achievements from './modules/achievementsModule'
import awards from './modules/awardsModule'

const store = createStore(
  {
    modules: {
      auth,
      apiClient,
      memberData,
      tournaments,
      notifications,
      leaderboard,
      currentMissions,
      featureMissions,
      theme,
      achievements,
      awards
    }
  });

export default store;