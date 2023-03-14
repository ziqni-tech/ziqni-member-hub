const state = {
  theme: null,
};

const getters = {
  getTheme(state) {
    return state.theme;
  },
};

const mutations = {
  SET_THEME(state, payload) {
    state.theme = payload;
  },
};

const actions = {
  setTheme({commit}, payload) {
    console.warn('THEME', payload);
    commit('SET_THEME', payload)
  },

};

export default {
  state,
  getters,
  mutations,
  actions,
};