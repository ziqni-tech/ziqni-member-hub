const state = {
  notifications: [],
  alertMessage: null,
  isLoaded: false,
  error: null
};

const getters = {
  getNotifications(state) {
    return state.notifications;
  },
  getAlertMessage(state) {
    return state.alertMessage;
  },
};

const mutations = {
  SET_NOTIFICATION_DATA(state, payload) {
    state.notifications.push(payload);
  },
  REMOVE_NOTIFICATION(state, payload) {
    state.notifications = state.notifications.filter(el => el.entityId !== payload);
  },
  SET_ALERT_MESSAGE(state, payload) {
    state.alertMessage = payload;
  },
  REMOVE_ALERT_MESSAGE(state, payload) {
    state.alertMessage = null;
  }
};

const actions = {
  setAlertMessage({commit}, payload) {
    commit('SET_ALERT_MESSAGE', payload)
  },
  removeAlertMessage({commit}, payload) {
    commit('REMOVE_ALERT_MESSAGE')
  },
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