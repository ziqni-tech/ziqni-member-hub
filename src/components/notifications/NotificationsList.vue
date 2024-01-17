<template>
<div class="notifications-list">
  <CListGroupItem v-for="item in notificationsList" class="notifications-list_item" v-if="notifications.length">
    <div class="notifications-list_item__data">
      <p class="notifications-list_item__data_title">
        {{ item.entityType }}
      </p>
      <p class="notifications-list_item__data_text">ID: {{ item.entityId }}</p>
    </div>
    <div class="notifications-list_item__close" @click="removeItem(item.entityId)">
      <img src="../../assets/icons/close-icon.png" alt="close">
    </div>
  </CListGroupItem>
  <div class="empty-notification-list" v-else>Notification list is empty</div>
</div>
</template>

<script setup>
import { CListGroupItem } from '@coreui/vue';

const emit = defineEmits(['removeNotification']);
const props = defineProps({ notifications: Array });
const notificationsList = props.notifications;

const removeItem = (id) => {
  emit('removeNotification', id)
}

</script>

<style scoped lang="scss">
@import '../../assets/scss/utils/vars';
.notifications-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 250px;
  height: 300px;
  overflow-y: scroll;
  position: absolute;
  bottom: -300px;
  left: 0;
  z-index: 10;
  border: 1px solid $border-base;
  border-radius: 8px;
  background-color: $primary-bg;

  &::-webkit-scrollbar {
    height: 7px;
    width: 0;
    background-color: $primary-bg;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: $scrollbar-color;
  }

  &_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 1px solid $border-base;
    padding-left: 5px;

    &__data {
      display: flex;
      flex-direction: column;
      &_title {
        text-align: start;
      }

      &_text {
        text-align: start;
        font-size: 14px;
      }
    }

    &__close {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

  }
}

.empty-notification-list {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>