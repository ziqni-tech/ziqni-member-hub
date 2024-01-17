const state = {
  apiClient: {},
  isConnectedClient: false
};
const getters = {
  getApiClient(state) {
    return state.apiClient;
  },
  getIsConnectedClient(state) {
    return state.isConnectedClient;
  }
};

const mutations = {
  SET_API_CLIENT(state, payload) {
    state.apiClient = payload;
  },
  SET_IS_CONNECTED_CLIENT(state, payload) {
    state.isConnectedClient = payload;
  }
};

const actions = {
  setApiClientAction({ commit }, payload) {
    commit('SET_API_CLIENT', payload);
  },
  setIsConnectedClient({ commit }, payload) {
    commit('SET_IS_CONNECTED_CLIENT', payload)
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};