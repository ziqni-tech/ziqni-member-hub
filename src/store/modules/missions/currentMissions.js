const state = {
  isLoading: false,
  currentMissions: [],
  totalRecords: 0,
  isLoaded: false,
  error: null
};
const getters = {
  getCurrentMissions(state) {
    return state.currentMissions;
  },
  getCurrentMissionsTotalRecords(state) {
    return state.totalRecords
  },
  getCurrentMissionsLoading(state) {
    return state.isLoading
  },
  getCurrentMissionsLoaded(state) {
    return state.isLoaded
  },
};

const mutations = {
  CURRENT_MISSIONS_API_REQUEST(state) {
    state.isLoading = true;
    state.isLoaded = false;
  },
  SET_CURRENT_MISSIONS(state, payload) {
    state.totalRecords = payload.meta.totalRecordsFound
    state.currentMissions = [...state.currentMissions, ...payload.data];
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_CURRENT_MISSIONS_ERROR(state, payload) {
    state.error = payload;
    state.isLoading = false;
    state.isLoaded = true;
  },
};

const actions = {
  currentMissionsRequest({ commit }, payload) {
    commit('CURRENT_MISSIONS_API_REQUEST')
  },
  setCurrentMissionsAction({ commit }, payload) {
    console.log('ACTION', payload);
    commit('SET_CURRENT_MISSIONS', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};