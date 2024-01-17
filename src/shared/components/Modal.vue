<template>
  <CModal
      alignment="center"
      :visible="modalShow"
      @close="close"
      :class="{'light-mode': !isDarkMode}"
  >
    <CModalHeader :class="{'light-mode': !isDarkMode}">
      <CModalTitle :class="{'light-mode': !isDarkMode}">{{ title }}</CModalTitle>
    </CModalHeader>
    <CModalBody :class="{'light-mode': !isDarkMode}">
      {{ messageGeneral }}
    </CModalBody>
    <CModalFooter :class="{'light-mode': !isDarkMode}">
      <CButton
          v-if="isCloseButton"
          color="light"
          @click="close"
          class="cancelBtn"
          :class="{'light-mode': !isDarkMode}"
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
  isDarkMode: Boolean,
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
  border-color: $main-border-color-LM;
}
.modal-footer.light-mode {
  background-color: $bg-body-LM
}
.modal-header.light-mode {
  background-color: $bg-body-LM
}
.modal-body.light-mode {
  background-color: $bg-body-LM;
  color: $card-text-color-LM;
}
.modal-body {
  color: $description-color-DM;
}
.modal-title {
  color: $text-color-white;
  font-family: $semi-bold;
  font-size: 16px;
}
.modal-title.light-mode {
  color: $section-title-color-LM;
  font-family: $semi-bold;
  font-size: 16px;
}
.modal-content.light-mode {
  font-family: $medium;
  font-size: 16px;
}
.modal-content {
  background-color: $secondary-bg-DM;
  font-family: $medium;
  font-size: 16px;

  .cancelBtn {
    background: none;
    color: $text-color-white;
    border-color: $btn-border-color-LM;
    font-family: $semi-bold;
    font-size: 16px;
  }

  .submitBtn {
    background-color: $btn-primary-bg-color-LM;
    color: $text-color-white;
    border: none;
    font-family: $semi-bold;
    font-size: 16px;
  }
}
.cancelBtn.light-mode {
  color: $btn-secondary-color-LM;
}
</style>