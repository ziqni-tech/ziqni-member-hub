const state = {
  memberData: {},
  isLoaded: false,
  error: null
};
const getters = {
  getMember(state) {
    return state.memberData;
  }
};

const mutations = {
  SET_MEMBER_DATA(state, payload) {
    state.memberData = payload;
  }
};

const actions = {
  setMemberAction({ commit }, payload) {
    console.log('ACTION', payload);
    commit('SET_MEMBER_DATA', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};