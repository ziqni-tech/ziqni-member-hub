<template>
  <CModal :visible="modalShow" size="sm" alignment="center">
    <h5 class="award-modal-title">{{ title }}</h5>
    <span class="award-description">{{ message }}</span>
    <CModalFooter>
      <button
          @click="doFunction"
          class="confirm-btn"
      >
        {{ btnLabel }}
      </button>
    </CModalFooter>
  </CModal>
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
.modal-footer, .modal-header {
  border: none;
}

.modal-content {
  background-color: $light-grey;
  color: $body-text-color;

  .award-modal-title {
    margin: auto;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $text-color-white;
    padding-top: 30px;
  }

  .award-description {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    padding-top: 10px;
  }


  .confirm-btn {
    margin: 20px auto;
    background-color: $purple;
    color: $text-color-white;
    border: none;

    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
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
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .award-description {
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      color: $body-text-color;
      padding-top: 10px;
    }


    .confirm-btn {
      margin: 20px auto;
      background: $btn-gradient-color;
      color: $text-color-white;
      border: none;

      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      padding: 10px 57px;
      border-radius: $border-radius;
    }
  }
}
</style>