const state = {
  currentPage: 1,
};
const getters = {
  getCurrentPage(state) {
    return state.currentPage;
  },
};

const mutations = {
  SET_CURRENT_PAGE(state, payload) {
    state.currentPage = payload;
  },
};

const actions = {
  setCurrentPage({ commit }, payload) {
    commit('SET_CURRENT_PAGE', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};