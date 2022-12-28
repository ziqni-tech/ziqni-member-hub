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
  },
  REMOVE_NOTIFICATION(state, payload) {
    const idx = state.notifications.findIndex(el => el.entityId === payload)
    state.notifications.splice(idx, 1);
  }
};

const actions = {
  setNotificationAction({ commit }, payload) {
    commit('SET_NOTIFICATION_DATA', payload);
  },
  removeNotificationAction({ commit }, payload) {
    commit('REMOVE_NOTIFICATION', payload)
  }
};

export default {
  state,
  getters,
  mutations,
  actions,
};