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
import currentPage from './modules/currentPageModule'
import currentTab from './modules/currentTabModule'
import configFile from './modules/configFileModule'
import sidebarNarrow from './modules/sidebarNarrowModule'

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
      awards,
      currentPage,
      currentTab,
      configFile,
      sidebarNarrow
    }
  });

export default store;