const state = {
  isLoading: false,
  leaderboardEntries: [],
  isLoaded: false,
  error: null
};

const getters = {
  getLeaderboardEntries(state) {
    return state.leaderboardEntries;
  },
  getLeaderboardIsLoading(state) {
    return state.isLoading
  },
  getLeaderboardIsLoaded(state) {
    return state.isLoaded
  }
};

const mutations = {
  API_REQUEST(state) {
    console.warn('API_REQUEST');
    state.isLoading = true;
    state.isLoaded = false;
  },
  SET_LEADERBOARD_DATA(state, payload) {
    state.leaderboardEntries = payload;
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_LEADERBOARD_ERROR(state, payload) {
    state.error = payload;
    state.isLoading = false;
    state.isLoaded = true;
  }
};

const actions = {
  leaderboardRequest({ commit }, payload) {
    commit('API_REQUEST')
  },
  setLeaderboardAction({ commit }, payload) {
    commit('SET_LEADERBOARD_DATA', payload);
  },
  setLeaderboardErrorAction({ commit}, payload) {
    commit('SET_LEADERBOARD_ERROR', payload)
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};