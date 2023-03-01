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
    return state.totalRecords
  },
  getFeatureMissionsLoading(state) {
    return state.isLoading
  },
  getFeatureMissionsLoaded(state) {
    return state.isLoaded
  },
};

const mutations = {
  FEATURE_MISSIONS_API_REQUEST(state) {
    state.isLoading = true;
    state.isLoaded = false;
  },
  SET_FEATURE_MISSIONS(state, payload) {
    state.featureMissions = [...state.featureMissions, ...payload.data];
    state.totalRecords = payload.meta.totalRecordsFound
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_FEATURE_MISSIONS_ERROR(state, payload) {
    state.error = payload;
    state.isLoading = false;
    state.isLoaded = true;
  },
};

const actions = {
  featureMissionsRequest({ commit }, payload) {
    commit('FEATURE_MISSIONS_API_REQUEST')
  },
  setFeatureMissionsAction({ commit }, payload) {
    console.log('ACTION', payload);
    commit('SET_FEATURE_MISSIONS', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};