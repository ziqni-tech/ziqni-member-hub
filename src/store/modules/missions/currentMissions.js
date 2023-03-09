const state = {
  isLoading: false,
  currentMissions: [],
  currentMission: null,
  totalRecords: 0,
  isLoaded: false,
  error: null
};
const getters = {
  getCurrentMissions(state) {
    return state.currentMissions;
  },
  getCurrentMission(state) {
    return state.currentMission;
  },
  getCurrentMissionsTotalRecords(state) {
    return state.totalRecords;
  },
};

const mutations = {
  SET_CURRENT_MISSIONS(state, payload) {
    state.currentMissions = [...state.currentMissions, ...payload];
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_CURRENT_MISSIONS_TOTAL_RECORDS(state, payload) {
    state.totalRecords = payload;
  },
  SET_CURRENT_MISSION(state, payload) {
    state.currentMission = payload;
  },
};

const actions = {
  setCurrentMissionsTotalRecords({ commit }, payload) {
    commit('SET_CURRENT_MISSIONS_TOTAL_RECORDS', payload);
  },
  setCurrentMissionsAction({ commit }, payload) {
    commit('SET_CURRENT_MISSIONS', payload);
  },
  setCurrentMissionAction({ commit }, payload) {
    commit('SET_CURRENT_MISSION', payload);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};