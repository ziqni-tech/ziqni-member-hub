const state = {
  currentTab: '',
};
const getters = {
  getCurrentTab(state) {
    return state.currentTab;
  },
};

const mutations = {
  SET_CURRENT_TAB(state, payload) {
    state.currentTab = payload;
  },
};

const actions = {
  setCurrentTab({ commit }, payload) {
    commit('SET_CURRENT_TAB', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};