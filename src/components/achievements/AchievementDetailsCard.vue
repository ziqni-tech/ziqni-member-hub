<template>
  <div class="achievements-details-card" :class="{'light-mode': !isDarkMode}">
    <div class="spinner-wrapper-global" v-if="isLoading">
      <Loader class="loader"/>
    </div>
    <button class="info-btn" @click="goToInfo">
      i
    </button>
    <div class="title">
      {{ achievement.name }}
    </div>
    <div class="icon">
      <img :src="achievementIconLink" alt="">
    </div>
    <div class="achievements-progress-wrapper">
      <span class="progress-title">Progress</span>
      <div class="achievements-progress">
        <div class="progress">
          <div class="progress-bar" :style="{ width: achievement.percentageComplete + '%' }"></div>
        </div>
        <div class="progress-value">
          {{ achievement.percentageComplete }}%
        </div>
      </div>
    </div>
    <div class="description" v-if="!isInfo">
      <span class="description-title">Description</span>
      <span class="description-value">
        {{ achievement.description ? removeHTMLTags(achievement.description) : testDescription }}
      </span>
    </div>
    <div class="description" v-if="isInfo">
      <span class="description-title">Terms & Conditions</span>
      <span class="description-value">{{ removeHTMLTags(achievement.termsAndConditions) }}</span>
    </div>
    <div class="bottom-section">
      <div class="prize-btn">
        <img :src="rewardIcon" alt="">
        {{ achievement.rewardValue }}
      </div>
      <button
          v-if="!isCompleted"
          class="action-btn"
          @click="handleButtonClick"
          :class="{ 'join-button': !isEntrant, 'leave-button': isEntrant }"
      >
        <span >{{ isEntrant ? 'Leave' : 'Join' }}</span>
      </button>
      <button
          v-else
          class="action-btn"
          :disabled="true"
      >
        <span>Completed</span>
      </button>
    </div>
  </div>
  <Modal
      :modalShow="leaveModal"
      :messageGeneral="'Are you sure you want to leave this achievement?'"
      :title="'Leave the achievement'"
      :successBtnLabel="'Leave'"
      @doFunction="leave"
      @closeModal="closeModal"
      v-on:toggle-modal="leaveModal = false"
  />
</template>

<script setup>

import defaultIcon from '@/assets/icons/achievements/book.svg';
import { computed, ref, toRef, watch } from 'vue';
import Modal from '@/shared/components/Modal.vue';
import diamondIcon from '@/assets/icons/achievements/diamond.png';
import { removeHTMLTags } from '@/utils/removeHTMLTags';
import Loader from '@/components/Loader.vue';

const props = defineProps({
  achievement: Object,
  isDarkMode: Boolean
});

const emit = defineEmits(['joinAchievement', 'leaveAchievement']);

const achievement = toRef(props, 'achievement');
const isCompleted = ref(achievement.value.entrantStatus === 'Completed');
const isLoading = ref(false);
const isInfo = ref(false);

const achievementIconLink = computed(() => {
  return achievement.value.iconLink
      ? achievement.value.iconLink
      : defaultIcon
})

const isEntrant = computed(() => {
  const entrantStatus = achievement.value.entrantStatus;
  return entrantStatus !== 'NotEntered' && entrantStatus !== 'Processing';
});

watch(achievement, (newVal) => {
  isLoading.value = false;
}, { immediate: true });

const rewardIcon = computed(() => {
  return props.achievement && props.achievement.rewardIconLink
      ? props.achievement.rewardIconLink
      : diamondIcon
})

const testDescription = ref('Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.');
const leaveModal = ref(false);
const closeModal = () => {
  leaveModal.value = false;
};

const join = () => {
  isLoading.value = true;
  emit('joinAchievement', {id: achievement.value.id, name: achievement.value.name});
};

const leave = () => {
  isLoading.value = true;
  emit('leaveAchievement', {id: achievement.value.id, name: achievement.value.name});
  leaveModal.value = false;
};

const handleButtonClick = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    if (isEntrant.value) {
      await leave();
    } else {
      await join();
    }
  } catch (e) {
    console.log('click btn error', e);
  }
};

const goToInfo = () => {
  isInfo.value = !isInfo.value
}

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';
.loader {
  top: 45%;
  z-index: 10;
}
.achievements-details-card {
  max-width: 840px;
  background-color: $card-bg-DM;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  position: relative;

  .info-btn {
    width: 30px;
    height: 30px;
    border-radius: $border-radius-sm;
    background: none;
    border: 1px solid $info-item-icon-bg-DM;
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: $white-color-DM
  }

  .title {
    font-family: $bold;
    font-size: 20px;
    color: $white-color-DM;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 30px 0 20px;
  }

  .icon {
    width: 150px;
    height: 150px;
    padding-top: 20px;
    border-radius: $border-radius-round;
    position: relative;
    overflow: hidden;
    border: 1px solid $btn-border-grey;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
      opacity: 0.5;
      filter: blur(37.5px);
    }

    > img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      height: 90%;
    }
  }

  .achievements-progress-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 50px;
    text-align: start;

    .progress-title {
      text-align: start;
      width: 100%;
      font-family: $medium;
      font-size: 14px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .achievements-progress {
      display: flex;
      width: 100%;

      .progress {
        width: 100%;
        height: 4px;
        background-color: $dark-blue;
        margin: 10px 0;

        .progress-bar {
          height: 100%;
          background: $blue-gradient;
          border-radius: $border-radius-sm;
        }
      }

      .progress-value {
        margin-left: 5px;
        font-size: 12px;
        font-family: $mainFont;
        color: $text-color-white;
      }
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    width: 100%;

    .description-title {
      text-align: start;
      width: 100%;
      font-size: 14px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .description-value {
      text-align: start;
      width: 100%;
      font-size: 12px;
      font-family: $mainFont;
      color: $text-color-white;
      padding-top: 14px;
    }
  }

  .bottom-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;

    .action-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      padding: 10px;
      border-radius: 10px;
      color: $white-color-DM;
      font-size: 14px;
    }

    .join-button {
      background: $btn-primary-bg-color-LM;
      border: 1px solid $btn-border-color-LM
    }

    .leave-button {
      border: 1px solid $btn-border-color-LM;
      background: none;
    }

    .disabled-btn {
      background: $btn-grey;
      border: 1px solid $btn-grey;
    }

    .prize-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;
      font-size: 14px;

      background: $prize-btn-bg-DM;
      border-radius: 10px;
      border: 1px solid $prize-btn-bg-DM;
      color: $white-color-DM;

      > img {
        margin-right: 10px;
        max-width: 40px;
        height: 30px;
        object-fit: cover;
      }
    }
  }

  &.light-mode {
    background-color: $card-bg-LM;
    border-radius: $border-radius;
    padding: 10px 25px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    font-family: $semi-bold;
    position: relative;

    .info-btn {
      width: 30px;
      height: 30px;
      border-radius: $border-radius-sm;
      background: none;
      border: 1px solid $main-border-color-LM;
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: $card-text-color-LM;
    }

    .title {
      color: $section-title-color-LM;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 30px;
    }

    .icon {
      width: 150px;
      height: 150px;
      padding-top: 20px;
      border-radius: $border-radius-round;
      position: relative;
      overflow: hidden;
      border: 1px solid $main-border-color-LM;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
        opacity: 0.5;
        filter: blur(37.5px);
      }

      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
      }
    }

    .achievements-progress-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 50px;
      text-align: start;

      .progress-title {
        text-align: start;
        width: 100%;
        font-size: 16px;
        color: $section-title-color-LM;
        padding-top: 20px;
      }

      .achievements-progress {
        display: flex;
        width: 100%;

        .progress {
          width: 100%;
          height: 4px;
          background-color: $bg-body-LM;
          margin: 10px 0;

          .progress-bar {
            height: 100%;
            background: $blue-gradient;
            border-radius: $border-radius-sm;
          }
        }

        .progress-value {
          color: $card-text-color-LM;
        }
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      width: 100%;

      .description-title {
        color: $card-title-color-LM;
      }

      .description-value {
        color: $card-title-color-LM;
        padding-top: 14px;
      }
    }

    .bottom-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 30px;

      .action-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        padding: 10px;
        border-radius: 10px;
        color: $text-color-white;
        font-size: 16px;
      }

      .join-button {
        background: $btn-primary-bg-color-LM;
        border: 1px solid $btn-border-color-LM;
        color: $btn-primary-color-LM;
      }

      .leave-button {
        border: 1px solid $btn-border-color-LM;
        background: none;
        color: $btn-secondary-color-LM;
      }

      .disabled-btn {
        background: $btn-prize-color-LM;
        border: 1px solid $btn-prize-color-LM;
        color: $btn-primary-color-LM;
      }

      .prize-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 57px;
        font-size: 16px;

        background: $btn-prize-bg-color-LM;
        border-radius: 10px;
        border: none;
        color: $btn-prize-color-LM;

        > img {
          margin-right: 10px;
          max-width: 40px;
          height: 30px;
          object-fit: cover;
        }
      }
    }
  }
}
@media screen and (max-width: 500px) {
  .achievements-details-card {
    max-width: 840px;
    border-radius: $border-radius;
    padding: 10px 25px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;


    .title {
      font-size: 14px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 30px;
    }

    .icon {
      width: 100px;
      height: 100px;
      padding-top: 20px;
      border-radius: $border-radius-round;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
        opacity: 0.5;
        filter: blur(37.5px);
      }

      > img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 90%;
      }
    }

    .achievements-progress-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-top: 50px;
      text-align: start;

      .progress-title {
        text-align: start;
        width: 100%;
        font-size: 10px;
        color: $text-color-white;
        padding-top: 20px;
      }

      .achievements-progress {
        display: flex;
        width: 100%;

        .progress {
          width: 100%;
          height: 4px;
          margin: 10px 0;

          .progress-bar {
            height: 100%;
            border-radius: $border-radius-sm;
          }
        }

        .progress-value {
          margin-left: 5px;
          font-weight: 500;
          font-size: 12px;
          line-height: 16px;
          color: $text-color-white;
        }
      }
    }

    .description {
      display: flex;
      flex-direction: column;

      .description-title {
        text-align: start;
        width: 100%;
        font-size: 16px;
        color: $text-color-white;
        padding-top: 20px;
      }

      .description-value {
        text-align: start;
        width: 100%;
        font-size: 12px;
        color: $text-color-white;
        padding-top: 14px;
      }
    }

    .bottom-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-top: 20px;

      .action-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        padding: 10px;
        font-size: 12px;

        //background: $purple-gradient;
        border-radius: 10px;
        //border: 1px solid $purple;
        //color: $text-color-white;
      }

      .disabled-btn {
        background: $btn-grey;
        border: 1px solid $btn-grey;
      }

      .prize-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 20px;
        margin-right: 10px;
        font-size: 12px;

        background: $dark-grey;
        border-radius: 10px;
        border: 1px solid $dark-grey;
        color: $text-color-white;

        > img {
          margin-right: 10px;
          max-width: 22px;
          height: 12px;
          object-fit: cover;
        }
      }
    }
  }
}
</style>