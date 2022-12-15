<template>
  <h1 class="section-title">Messages</h1>
  <CListGroup v-for="message in messages">
    <CListGroupItem>
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
import { ref } from 'vue';

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

const messages = ref([]);

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
.list-group-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>