<template>
  <CListGroup v-for="message in messages" v-if="isLoaded">
    <CListGroupItem class="list-group-item">
      <div class="avatar">
        <img src="../assets/icons/messages/message-avatar.png" alt="">
      </div>
      <div class="message-body">
        <span class="message-body__type" >{{ message.messageType }}</span>
        <span class="message-body__body">{{ message.body }}</span>
      </div>
      <span class="created">{{ message.created }}</span>
    </CListGroupItem>
  </CListGroup>
  <Loader v-else />
</template>


<script setup>
import { ApiClientStomp, MessagesApiWs } from '@ziqni-tech/member-api-client';
import { CListGroup, CListGroupItem } from '@coreui/vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import Loader from '../components/Loader';

const store = useStore();
const messages = ref([]);
const isDarkMode = computed(() => store.getters.getTheme);

const isLoaded = ref(false)

const getMessagesRequest = async () => {
  const messagesApiWsClient = new MessagesApiWs(ApiClientStomp.instance);
  const messageRequest = {
    messageFilter: {
      messageType: 'InboxItem',
      skip: 0,
      limit: 20
    }
  };

  await messagesApiWsClient.getMessages(messageRequest, (res) => {
    messages.value = res.data;
    isLoaded.value = true;
  });
}
getMessagesRequest()
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables';

.loader{
  margin-top: 20%;
}

.list-group-item {
  display: flex;
  align-items: center;

  margin-bottom: 5px;
  background-color: $light-grey;
  color: $main-text-color-white;

  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $border-radius-round;

    & > img {
      width: inherit;
      height: inherit;
    }
  }

  .message-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;

    &__type {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: $body-text-color;
    }

    &__body {
      font-weight: 400;
      font-size: 12px;
      line-height: 146.5%;
      color: $main-text-color-white;
    }
  }

  .created {
    margin-left: auto;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $body-text-color;
  }
}

//.list-group-item.darkMode {
//  background-color: $light-grey;
//  border: 1px solid $border-header-dark-mode;
//  color: $light-grey;
//}
//.list-group-item.lightMode {
//  background-color: $primary-bg-dark-LM;
//  border: 1px solid $border-header-light-mode;
//  color: $txt-dark-grey;
//}
</style>