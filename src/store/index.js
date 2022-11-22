import { createStore } from 'vuex';
import apiClient from './modules/apiClientModule';
import memberData from './modules/memberModule';
import currentCompetitions from './modules/currentCompetitionModule'

const store = createStore(
  {
    modules: {
      apiClient,
      memberData,
      currentCompetitions
    }
  });

export default store;