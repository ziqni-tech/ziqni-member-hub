<template>
  <CAlert
      class="alert-message"
      color="success"
      :visible="showAlert"
      dismissible
      @close="closeAlert"
  >
    <h1 class="alert-message_title">
      {{ messageItem }}
    </h1>
<!--    <p>ID: {{ messageItem.entityId }}</p>-->
  </CAlert>
</template>

<script setup>
import { CAlert } from '@coreui/vue';
import { computed, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
// :color="success ? 'success':  'danger'"

// const props = defineProps({ message: Object });
const messageItem = ref(null);
const showAlert = ref(false);
const store = useStore()

const alertMessage = computed(() => store.getters.getAlertMessage)

// watchEffect(() => {
//   if (props.message) {
//     messageItem.value = props.message;
//     showMessage();
//   }
// });

watch(alertMessage, (currentValue, oldValue) => {
  if (currentValue) {
    console.warn('STORE', currentValue);
    messageItem.value = currentValue;
    showMessage();
  }
})

const showMessage = () => {
  console.warn('SHOW MESSAGE', messageItem.value);
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
    store.dispatch('removeAlertMessage')
  }, 5000);
};

const closeAlert = () => {
  showAlert.value = false;
};

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