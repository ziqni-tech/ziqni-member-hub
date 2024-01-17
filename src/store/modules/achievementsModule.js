const state = {
  achievements: [],
  achievementsTotalRecords: null
};
const getters = {
  getAchievements(state) {
    return state.achievements;
  },
  getAchievementsTotal(state) {
    return state.achievementsTotalRecords
  }
};

const mutations = {
  SET_ACHIEVEMENTS(state, payload) {
    state.achievements = payload;
  },
  SET_ACHIEVEMENTS_TOTAL(state, payload) {
    state.achievementsTotalRecords = payload;
  },
};

const actions = {
  setAchievements({ commit }, payload) {
    commit('SET_ACHIEVEMENTS', payload);
  },
  setAchievementsTotalRecords({ commit }, payload) {
    commit('SET_ACHIEVEMENTS_TOTAL', payload)
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};