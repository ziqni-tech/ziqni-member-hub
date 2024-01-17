const state = {
  isNarrow: null,
};

const getters = {
  getIsSidebarNarrow(state) {
    return state.isNarrow;
  },
};

const mutations = {
  SET_IS_SIDEBAR_NARROW(state, payload) {
    state.isNarrow = payload;
  },
};

const actions = {
  setIsSidebarNarrow({commit}, payload) {
    commit('SET_IS_SIDEBAR_NARROW', payload)
  },

};

export default {
  state,
  getters,
  mutations,
  actions,
};