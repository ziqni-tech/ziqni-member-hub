import { createStore } from 'vuex';
import apiClient from './modules/apiClientModule';
import memberData from './modules/memberModule';

const store = createStore(
  {
    modules: {
      apiClient,
      memberData
    }
  });

export default store;