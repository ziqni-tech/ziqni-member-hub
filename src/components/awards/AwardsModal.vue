<template>
  <div class="modal-content">
    <h5 class="award-modal-title">{{ title }}</h5>
    <span class="award-description">{{ message }}</span>
      <button
          @click="doFunction"
          class="confirm-btn"
      >
        {{ btnLabel }}
      </button>
  </div>
</template>

<script setup>
import { CModal, CModalFooter } from '@coreui/vue';

const props = defineProps({
  title: String,

  message: String,
  modalShow: Boolean,
  btnLabel: {
    type: String,
    default: 'Claim'
  },
  classes: {
    type: Array,
    default() {
      return []
    }
  },
})

const emit = defineEmits(['doFunction'])

const doFunction = () => {
  emit('doFunction')
}

</script>

<style scoped lang="scss">
@import 'src/assets/scss/_variables';

.modal-content {
  background-color: $light-grey;
  color: $body-text-color;
  font-family: $semi-bold;
  border-radius: $border-radius;
  border: 1px solid $dark-blue;
  padding: 28px 38px;
  max-width: 480px;
  box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50);

  .award-modal-title {
    margin: auto;
    font-size: 20px;
    color: $text-color-white;
  }

  .award-description {
    font-size: 16px;
    color: $body-text-color;
    padding-top: 10px;
  }


  .confirm-btn {
    margin: 20px auto;
    background-color: $purple;
    color: $text-color-white;
    border: none;
    font-size: 16px;
    padding: 10px 57px;
    border-radius: $border-radius;
  }
}
@media screen and (max-width: $tableWidth) {
  .modal-content {
    background-color: $light-grey;
    color: $body-text-color;

    .award-modal-title {
      margin: auto;
      color: $text-color-white;
    }

    .award-description {
      color: $body-text-color;
      padding-top: 10px;
    }


    .confirm-btn {
      margin: 20px auto;
      background: $btn-gradient-color;
      color: $text-color-white;
      border: none;

      font-size: 16px;
      padding: 10px 57px;
      border-radius: $border-radius;
    }
  }
}
</style>