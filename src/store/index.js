import { createStore } from 'vuex';
import auth from './modules/authModule';
import apiClient from './modules/apiClientModule';
import memberData from './modules/memberModule';
import currentCompetitions from './modules/currentCompetitionModule'

const store = createStore(
  {
    modules: {
      auth,
      apiClient,
      memberData,
      currentCompetitions
    }
  });

export default store;