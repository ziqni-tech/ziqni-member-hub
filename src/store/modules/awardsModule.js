const state = {
  isScratchAll: false
};
const getters = {
  getIsScratchAll(state) {
    return state.isScratchAll;
  },
};

const mutations = {
  SET_IS_SCRATCH_ALL(state, payload) {
    state.isScratchAll = payload;
  },
};

const actions = {
  setIsScratchAllCards({ commit }, payload) {
    commit('SET_IS_SCRATCH_ALL', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};