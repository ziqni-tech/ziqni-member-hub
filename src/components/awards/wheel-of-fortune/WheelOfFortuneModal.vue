<template>
  <div class="modal-content" :class="{'light-mode': !isDarkMode}">
    <div class="award-modal-title" v-html="title"></div>
    <div class="award-description" v-html="message"></div>
    <div class="award-data" v-if="reward && reward.name">
      <div v-html="reward.name"></div>:
      <div v-html="reward.value"></div>
    </div>
      <button
          @click="doFunction"
          class="confirm-btn"
      >
        {{ btnLabel }}
      </button>
  </div>
</template>

<script setup>

const props = defineProps({
  title: String,
  reward: {
    type: Object,
    default: () => null,
  },
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
  isDarkMode: Boolean,
})

const emit = defineEmits(['doFunction'])

const doFunction = () => {
  emit('doFunction')
}

</script>

<style scoped lang="scss">
@import '../../../assets/scss/variables';

.modal-content {
  background-color: $modal-bg-DM;
  font-family: $semi-bold;
  border-radius: $border-radius;
  border: 1px solid $border-color-DM;
  padding: 28px 38px;
  width: 290px;
  box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50);

  position: absolute;
  top: 61%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;

  .award-modal-title {
    margin: auto;
    font-size: 20px;
    font-family: $bold;
    color: $prize-name-DM;
  }

  .award-description {
    font-size: 14px;
    font-family: $medium;
    color: $description-color-DM;
    padding-top: 10px;
  }

  .award-data {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;

    & > div {
      &:first-of-type {
      }

      &:last-of-type {
        margin-left: 5px;
      }
    }
  }

  .confirm-btn {
    margin: 20px auto;
    background-color: $btn-primary-bg-color-LM;
    color: $text-color-white;
    border: none;
    font-size: 14px;
    font-family: $bold;
    padding: 10px 57px;
    border-radius: $border-radius;
  }

  &.light-mode {
    background-color: $bg-body-LM;
    border: 1px solid $border-pink;
    box-shadow: 0 2px 12px 0 rgba(64, 106, 140, 0.50);

    .award-modal-title {
      margin: auto;
      font-size: 20px;
      font-family: $bold;
      color: $info-name-color;
    }

    .award-description {
      font-size: 14px;
      font-family: $medium;
      color: $card-title-color-LM;
      padding-top: 10px;
    }

    .award-data {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
@media screen and (max-width: $tableWidth) {
  .modal-content {
    .award-modal-title {
      margin: auto;
      font-size: 14px;
    }

    .award-description {
      font-size: 12px;
      padding-top: 10px;
    }

    .confirm-btn {
      margin: 20px auto;
      border: none;

      font-size: 12px;
      padding: 7px 57px;
      border-radius: $border-radius;
    }
  }
}
</style>