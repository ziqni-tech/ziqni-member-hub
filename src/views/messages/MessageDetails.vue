<template>
  <div class="details-content">
    <MessageDetailsCard v-if="isLoaded" :message="message" />
  </div>
</template>

<script setup>
import { ApiClientStomp, MessagesApiWs } from "@ziqni-tech/member-api-client";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import MessageDetailsCard from "@/components/messages/MessageDetailsCard.vue";

const message = ref(null)
const isLoaded = ref(false)

const route = useRoute();


onMounted(() => {
  getMessagesRequest();
})
const getMessagesRequest = async () => {
  const messagesApiWsClient = new MessagesApiWs(ApiClientStomp.instance);
  const messageRequest = {
    messageFilter: {
      ids: [route.params.id],
      messageType: 'InboxItem',
      skip: 0,
      limit: 1
    }
  };

  await messagesApiWsClient.getMessages(messageRequest, (res) => {
    message.value = res.data[0];
    isLoaded.value = true;
  });
}
</script>

<style scoped lang="scss">

</style>