const state = {
  currentCompetitions: [],
  isLoaded: false,
  error: null
};
const getters = {
  getCurrentCompetitions(state) {
    return state.currentCompetitions;
  }
};

const mutations = {
  SET_CURRENT_COMPETITIONS(state, payload) {
    state.currentCompetitions = payload;
  }
};

const actions = {
  setCurrentCompetitionsAction({ commit }, payload) {
    commit('SET_CURRENT_COMPETITIONS', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};