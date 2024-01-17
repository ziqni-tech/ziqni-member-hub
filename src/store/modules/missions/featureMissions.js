const state = {
  isLoading: false,
  featureMissions: [],
  totalRecords: 0,
  isLoaded: false,
  error: null
};
const getters = {
  getFeatureMissions(state) {
    return state.featureMissions;
  },
  getFeatureMissionsTotalRecords(state) {
    return state.totalRecords;
  },
};

const mutations = {
  SET_FEATURE_MISSIONS(state, payload) {
    state.featureMissions = [...state.featureMissions, ...payload];
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_FEATURE_MISSIONS_TOTAL_RECORDS(state, payload) {
    state.totalRecords = payload;
  },
};

const actions = {
  setFeatureMissionsAction({ commit }, payload) {
    commit('SET_FEATURE_MISSIONS', payload);
  },
  setCurrentMissionsTotalRecords({ commit }, payload) {
    commit('SET_FEATURE_MISSIONS_TOTAL_RECORDS', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};