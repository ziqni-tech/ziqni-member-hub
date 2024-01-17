const state = {
  configFile: null
};
const getters = {
  getConfigFile(state) {
    return state.configFile;
  },
};

const mutations = {
  SET_CONFIG_FILE(state, payload) {
    state.configFile = payload;
  },
};

const actions = {
  setConfigFile({ commit }, payload) {
    commit('SET_CONFIG_FILE', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};