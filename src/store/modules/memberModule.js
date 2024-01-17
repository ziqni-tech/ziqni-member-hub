const state = {
  isLoading: false,
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
  API_REQUEST(state) {
    state.isLoading = true;
    state.isLoaded = false;
  },
  SET_MEMBER_DATA(state, payload) {
    state.memberData = payload;
  }
};

const actions = {
  setMemberAction({ commit }, payload) {
    commit('SET_MEMBER_DATA', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};