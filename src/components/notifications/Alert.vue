<template>
  <CAlert
      class="alert-message"
      color="info"
      :visible="showAlert"
      dismissible
      @close="closeAlert"
  >
    <h1 class="alert-message_title">
      {{ messageItem.entityType }}
    </h1>
    <p>ID: {{ messageItem.entityId }}</p>
  </CAlert>
</template>

<script setup>
import { CAlert } from '@coreui/vue';
import { ref, watchEffect } from 'vue';

const props = defineProps({ message: Object });
const messageItem = ref(null);
const showAlert = ref(false)

watchEffect(() => {
  if (props.message) {
    messageItem.value = props.message;
    // showAlert.value = true
  }
})

const closeAlert = () => {
  showAlert.value = false
}

</script>

<style scoped lang="scss">
//.alert {
//  background-color: rgba(93, 83, 194, 0.3);
//  color: #FAFAFE;
//}
.alert-message {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translate(-50%);
  z-index: 150;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &_title {
    align-self: center;
  }
}
</style>