import { createStore } from 'vuex';
import auth from './modules/authModule';
import apiClient from './modules/apiClientModule';
import memberData from './modules/memberModule';
import currentCompetitions from './modules/currentCompetitionModule';
import notifications from './modules/notificationModule';

const store = createStore(
  {
    modules: {
      auth,
      apiClient,
      memberData,
      currentCompetitions,
      notifications
    }
  });

export default store;