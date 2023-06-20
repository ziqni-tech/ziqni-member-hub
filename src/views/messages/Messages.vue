<template>
  <CListGroup v-for="message in messages" v-if="isLoaded">
    <CListGroupItem class="list-group-item" @click="goToMessageDetails(message)">
      <div class="avatar">
        <img src="../../assets/icons/messages/message-avatar.png" alt="">
      </div>
      <div class="message-body">
        <span class="message-body__type" >{{ message.messageType }}</span>
        <span class="message-body__body">{{ message.body }}</span>
      </div>
      <div class="created">
        <span class="date">{{ formattedDate(message.created) }}</span>
        <span class="date">{{ formattedTime(message.created) }}</span>
      </div>
    </CListGroupItem>
  </CListGroup>
  <Loader v-else />
</template>


<script setup>
import { ApiClientStomp, MessagesApiWs } from '@ziqni-tech/member-api-client';
import { CListGroup, CListGroupItem } from '@coreui/vue';
import {computed, onMounted, ref} from 'vue';
import { useStore } from 'vuex';
import Loader from '../../components/Loader.vue';
import {useRouter} from "vue-router";

const store = useStore();
const messages = ref([]);
const isDarkMode = computed(() => store.getters.getTheme);
const router = useRouter();

const isLoaded = ref(false)

onMounted(() => {
  getMessagesRequest();
})

const goToMessageDetails = (message) => {
  console.warn('Message click', message)
  router.push({
    name: 'MessageDetails',
    params: {
      id: message.id,
    }
  })
}

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
    console.warn('MESSAGES', res.data)
    isLoaded.value = true;
  });
}

const formattedDate = (dateString) => {
  console.log(dateString);
  const date = new Date(dateString)
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return `${day}.${month}.${year}`
}

const formattedTime = (dateString) => {
  const date = new Date(dateString)
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours}:${minutes}`
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.loader{
  margin-top: 20%;
}

.list-group-item {
  display: flex;
  align-items: center;

  margin-bottom: 5px;
  background-color: $light-grey;
  color: $text-color-white;

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
      color: $text-color-white;
    }
  }

  .created {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: $body-text-color;

    .date {
      text-align: right;
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .list-group-item {
    display: flex;
    align-items: center;

    margin-bottom: 5px;
    background-color: $light-grey;
    color: $text-color-white;

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
        max-width: 160px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        font-weight: 400;
        font-size: 12px;
        line-height: 146.5%;
        color: $text-color-white;
      }
    }

    .created {
      font-weight: 500;
      font-size: 10px;
      line-height: 12px;
    }
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