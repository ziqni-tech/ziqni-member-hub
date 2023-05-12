<template>
  <h1 class="section-title">Messages</h1>
  <CListGroup v-for="message in messages">
    <CListGroupItem class="list-group-item">
      <span>messageType: {{ message.messageType }}</span>
      <span>body: {{ message.body }}</span>
      <span>created: {{ message.created }}</span>
      <span>expiry: {{ message.expiry }}</span>
    </CListGroupItem>
  </CListGroup>
</template>


<script setup>
import { ApiClientStomp, MessagesApiWs } from '@ziqni-tech/member-api-client';
import { CListGroup, CListGroupItem } from '@coreui/vue';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

// body:"message body"
// created:"2022-12-15T14:25:37.739Z"
// customFields:{}
// eventRefId:null
// eventRefType:null
// expiry:"2022-12-15T14:25:37.739Z"
// id:"lZstFoUB2Kz4vKupLc3L"
// memberIds:null
// memberTags:[]
// messageType:"InboxItem"
// metadata:{}
// spaceName:"test-space-1"
// status:null

const store = useStore();
const messages = ref([]);
const isDarkMode = computed(() => store.getters.getTheme);

const messagesApiWsClient = new MessagesApiWs(ApiClientStomp.instance);
const messageRequest = {
  messageFilter: {
    messageType: 'InboxItem',
    skip: 0,
    limit: 20
  }
};

messagesApiWsClient.getMessages(messageRequest, (res) => {
  messages.value = res.data;
  console.warn('MESSAGES', res);
});
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables';

.list-group-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 5px;
  background-color: $light-grey;
  color: $main-text-color-white;
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