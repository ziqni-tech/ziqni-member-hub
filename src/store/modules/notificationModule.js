const state = {
  notifications: [],
  isLoaded: false,
  error: null
};
const getters = {
  getNotifications(state) {
    return state.notifications;
  }
};

const mutations = {
  SET_NOTIFICATION_DATA(state, payload) {
    state.notifications.push(payload);
  }
};

const actions = {
  setNotificationAction({ commit }, payload) {
    commit('SET_NOTIFICATION_DATA', payload);
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};