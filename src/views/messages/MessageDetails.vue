<template>
  <div class="details-content">
    <MessageDetailsCard
        v-if="isLoaded"
        :message="message"
        :isDarkMode="isDarkMode"
    />
  </div>
</template>

<script setup>
import { ApiClientStomp, MessagesApiWs } from '@ziqni-tech/member-api-client';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import MessageDetailsCard from '@/components/messages/MessageDetailsCard.vue';
import { useStore } from 'vuex';

const message = ref(null);
const isLoaded = ref(false);

const route = useRoute();
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {};
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

onMounted(() => {
  getMessagesRequest();
});
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
};
</script>

<style scoped lang="scss">

</style>