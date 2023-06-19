<template>
  <CModal alignment="center" :visible="modalShow" @close="close">
    <CModalHeader>
      <CModalTitle>{{ title }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      {{ messageGeneral }}
    </CModalBody>
    <CModalFooter>
      <CButton
          v-if="isCloseButton"
          color="light"
          @click="close"
          class="cancelBtn"
      >
        {{ cancelBtnLabel }}
      </CButton>
      <CButton
          v-if="isSuccessButton"
          @click="doFunction"
          color="primary"
          class="submitBtn"
      >
        {{ successBtnLabel }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/vue';

const props = defineProps({
  title: String,
  toolTipText: String,
  subTitle: String,
  dangerText: String,
  closeBtnClass: String,
  messageGeneral: String,
  modalShow: Boolean,
  cancelBtnLabel: {
    type: String,
    default: 'Close'
  },
  successBtnLabel: {
    type: String,
    default: 'I\'m Sure!'
  },
  classes: {
    type: Array,
    default() {
      return []
    }
  },
  isSuccessButton: {
    type: Boolean,
    default: true
  },
  isCloseButton: {
    type: Boolean,
    default: true
  },
  loading: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['doFunction', 'closeModal'])

const doFunction = () => {
  emit('doFunction')
}

const close = () => {
  emit('closeModal')
}

</script>

<style lang="scss">
@import 'src/assets/scss/_variables';
.modal-footer, .modal-header {
  border-color: $border-dark;
}
.modal-content {
  background-color: $light-grey;
  color: $body-text-color;

  .cancelBtn {
    background-color: $btn-grey;
    color: $text-color-white;
    border: none;
  }

  .submitBtn {
    background-color: $purple;
    color: $text-color-white;
    border: none;
  }
}
</style>