const state = {
  apiClient: {},
};
const getters = {
  getApiClient(state) {
    return state.apiClient;
  }
};

const mutations = {
  SET_API_CLIENT(state, payload) {
    state.apiClient = payload;
  }
};

const actions = {
  setApiClientAction({ commit }, payload) {
    commit('SET_API_CLIENT', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};