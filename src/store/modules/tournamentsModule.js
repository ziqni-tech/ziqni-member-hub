const state = {
  isLoading: false,
  currentTournaments: [],
  currentTournamentsTotalRecords: 0,
  featureTournaments: [],
  featureTournamentsTotalRecords: 0,
  currentTournament: null,
  isLoaded: false,
  error: null
};
const getters = {
  getCurrentTournaments(state) {
    return state.currentTournaments;
  },
  getCurrentTournament(state) {
    return state.currentTournament;
  },
  getCurrentTournamentsLoading(state) {
    return state.isLoading
  },
  getCurrentTournamentsLoaded(state) {
    return state.isLoaded
  },
  getCurrentTournamentsTotalRecords(state) {
    return state.currentTournamentsTotalRecords;
  },
  getFeatureTournaments(state) {
    return state.featureTournaments;
  },
  getFeatureTournamentsLoading(state) {
    return state.isLoading
  },
  getFeatureTournamentsLoaded(state) {
    return state.isLoaded
  },
  getFeatureTournamentsTotalRecords(sate) {
    return state.featureTournamentsTotalRecords;
  }
};

const mutations = {
  CURRENT_TOURNAMENTS_API_REQUEST(state) {
    state.isLoading = true;
    state.isLoaded = false;
  },
  FEATURE_TOURNAMENTS_API_REQUEST(state) {
    state.isLoading = true;
    state.isLoaded = false;
  },
  SET_CURRENT_TOURNAMENT(state, payload) {
    state.currentTournament = payload;
  },
  SET_CURRENT_TOURNAMENTS(state, payload) {
    const { data, meta } = payload;
    state.currentTournamentsTotalRecords = meta.totalRecordsFound;
    state.currentTournaments = [...state.currentTournaments, ...data];
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_FEATURE_TOURNAMENTS(state, payload) {
    const { data, meta } = payload;
    state.featureTournamentsTotalRecords = meta.totalRecordsFound;
    state.featureTournaments = [...state.featureTournaments, ...data];
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_CURRENT_TOURNAMENTS_ERROR(state, payload) {
    state.error = payload;
    state.isLoading = false;
    state.isLoaded = true;
  },
  SET_FEATURE_TOURNAMENTS_ERROR(state, payload) {
    state.error = payload;
    state.isLoading = false;
    state.isLoaded = true;
  }
};

const actions = {
  currentTournamentsRequest({ commit }, payload) {
    commit('CURRENT_TOURNAMENTS_API_REQUEST')
  },
  featureTournamentsRequest({ commit }, payload) {
    commit('FEATURE_TOURNAMENTS_API_REQUEST')
  },
  setCurrentTournamentAction({ commit }, payload) {
    commit('SET_CURRENT_TOURNAMENT', payload);
  },
  setCurrentTournamentsAction({ commit }, payload) {
    commit('SET_CURRENT_TOURNAMENTS', payload);
  },
  setFeatureTournamentsAction({ commit }, payload) {
    commit('SET_FEATURE_TOURNAMENTS', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};