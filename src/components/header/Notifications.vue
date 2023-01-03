<template>
  <div class="notifications" @click="showNotifications">
    <div class="icon-wrapper">
      <img class="icon" src="../../assets/icons/bell-icon.svg" alt="">
    </div>
    <span class="number-of-notifications">{{ notificationsList.length }}</span>
    <NotificationsList
      v-if="isShowNotifications"
      :notifications="notificationsList"
      @removeNotification="removeNotification"
    />
  </div>
</template>

<script setup>
import NotificationsList from '../notifications/NotificationsList';
import { ref, watchEffect } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const props = defineProps({ messages: Array});

const notificationsList = ref([]);

const makeUniqArr = (arr) => {
  const seen = {};
  const result = [];
  let j = 0;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    const key = item.entityId;
    if (!seen[key]) {
      seen[key] = 1;
      result[j++] = item;
    }
  }

  return result;
};

watchEffect(() => {
  const notifications = store.getters.getNotifications;
  notificationsList.value = makeUniqArr(notifications);
})

const isShowNotifications = ref(false);

const showNotifications = () => {
  isShowNotifications.value = !isShowNotifications.value;
};

const removeNotification = (val) => {
  store.dispatch('removeNotificationAction', val);
};

</script>

<style lang="scss">
@import '../../assets/scss/variables';

.notifications {
  display: flex;
  align-items: center;
  position: relative;

  .icon-wrapper {
    width: 25px;
    height: 25px;
    object-fit: cover;
    overflow: hidden;
    cursor: pointer;

    .icon {
      width: 100%;
      height: 100%;
    }
  }

  .number-of-notifications {
    padding: 0 6px;
    font-family: 'Poppins', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 10px;
    color: $nav-text-color;
  }
}

</style>