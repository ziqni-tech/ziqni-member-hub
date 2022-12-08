const state = {
  memberToken: '',
};
const getters = {
  getMemberToken(state) {
    return state.memberToken;
  }
};

const mutations = {
  SET_MEMBER_TOKEN(state, payload) {
    state.memberToken = payload;
  }
};

const actions = {
  setMemberTokenAction({ commit }, payload) {
    commit('SET_MEMBER_TOKEN', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};