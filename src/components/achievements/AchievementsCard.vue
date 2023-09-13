<template>
  <div
      class="achievements-card"
      :class="{'light-mode': !isDarkMode}"
      @click="goToAchievementDetails"
  >
    <div class="top-section">
      <div class="left-section">
        <div class="icon">
          <img :src="achievementIconLink" alt="">
        </div>
      </div>
      <div class="right-section">
        <div class="title">
          {{ achievement.name }}
        </div>
        <div class="achievements-progress">
          <div class="progress">
            <div class="progress-bar" :style="{ width: achievement.percentageComplete + '%' }"></div>
          </div>
          <div class="progress-value">
            {{ achievement.percentageComplete }}%
          </div>
        </div>
        <button
            class="btn leave-button"
            :class="{'join-btn': !isEntrant}"
            @click.stop="isEntrant ? openModal() : join()"
        >
          {{ isEntrant ? 'Leave' : 'Join' }}
        </button>
      </div>
    </div>
  </div>
  <Modal
    :modalShow="leaveModal"
    :messageGeneral="'Are you sure you want to leave this achievement?'"
    :title="'Leave the achievement'"
    :successBtnLabel="'Leave'"
    :isDarkMode="isDarkMode"
    @doFunction="leave"
    @closeModal="closeModal"
    v-on:toggle-modal="leaveModal = false"
  />
</template>

<script setup>
import { computed, ref, toRef } from 'vue';
import { useStore } from 'vuex';

import Modal from '@/shared/components/Modal.vue';
import defaultIcon from '@/assets/icons/achievements/book.svg'
import router from '@/router';
import diamondIcon from '@/assets/icons/achievements/diamond.png';

const props = defineProps({
  achievement: { type: Object, required: true },
  isDarkMode: Boolean
});

const achievementIconLink = computed(() => {
  return props.achievement && props.achievement.iconLink
      ? props.achievement.iconLink
      : defaultIcon
});

const rewardIcon = computed(() => {
  return props.achievement && props.achievement.rewardIconLink
      ? props.achievement.rewardIconLink
      : diamondIcon
})

const store = useStore();

const emit = defineEmits(['joinAchievement', 'leaveAchievement']);

let leaveModal = ref(false);

const achievement = toRef(props, 'achievement');

const isEntrant = computed(() => achievement.value.entrantStatus === 'Entrant');

const openModal = () => {
  leaveModal.value = true;
};

const closeModal = () => {
  leaveModal.value = false;
};


const join = () => {
  emit('joinAchievement', { id: achievement.value.id, name: achievement.value.name });
};

const leave = () => {
  emit('leaveAchievement', { id: achievement.value.id, name: achievement.value.name });
  leaveModal.value = false;
};

const goToAchievementDetails = () => {
  router.push({
    name: 'AchievementDetails',
    params: {
      id: achievement.value.id,
    }
  })
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.achievements-card {
  width: 100%;
  background-color: $card-bg-DM;
  border-radius: $border-radius;
  padding: 14px 10px;

  cursor: pointer;

  .top-section {
    display: flex;
  }

  .left-section {
    width: 84px;

    .icon {
      width: 84px;
      height: 84px;
      border-radius: $border-radius-round;
      border: 1px solid $btn-border-grey;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

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
        width: 90%;
        height: 90%;
        border-radius: $border-radius-round;
      }
    }
  }

  .right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 0 0 8px;

    .title {
      font-family: $bold;
      font-size: 14px;
      color: $white-color-DM;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .achievements-progress {
      display: flex;
      margin-top: 10px;
      width: 100%;

      .progress {
        width: 90%;
        height: 4px;
        background-color: $progress-bg-DM;
        margin: 10px 0;

        .progress-bar {
          height: 100%;
          background: $blue-gradient;
          border-radius: $border-radius-sm;
        }
      }

      .progress-value {
        margin-left: 5px;
        font-family: $medium;
        font-size: 12px;
        line-height: 16px;
        color: $white-color-DM;
      }
    }

    .btn {
      width: 108px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;
      margin-top: 10px;

      font-size: 14px;
      font-family: $bold;
      color: $white-color-DM;

      > img {
        margin-right: 5px;
      }
    }

    .leave-button {
      background: none;
      border: 1px solid $btn-border-color-LM;
    }

    .join-btn {
      background: $btn-primary-bg-color-LM;
    }
  }

  &.light-mode {
    background-color: $card-bg-LM;

    .top-section {
      //border-bottom: 1px solid $main-border-color-LM;
    }

    .left-section {

      .icon {
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
          width: 90%;
          height: 90%;
          border-radius: $border-radius-round;
        }
      }
    }

    .right-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 0 0 8px;

      .title {
        font-family: $bold;
        font-size: 14px;
        font-style: normal;
        line-height: normal;
        color: $card-title-color-LM;
      }

      .achievements-progress {
        display: flex;
        margin-top: 10px;
        width: 100%;

        .progress {
          width: 90%;
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
          margin-left: 5px;
          font-family: $medium;
          font-size: 12px;
          line-height: 16px;
          color: $card-text-color-LM;
        }
      }
      .btn {
        width: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;
        margin-top: 10px;

        font-size: 14px;
        font-family: $bold;
        color: $white-color-DM;

        > img {
          margin-right: 5px;
        }
      }

      .leave-button {
        background: none;
        border: 1px solid $btn-border-color-LM;
        color: #202B38;
      }

      .join-btn {
        background: $btn-primary-bg-color-LM;
        color: white;
      }
    }

    .bottom-section {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .btn {
        width: 108px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius;

        font-size: 14px;
        font-family: $bold;
        color: $btn-primary-color-LM;

        > img {
          margin-right: 5px;
        }
      }

      .leave-button {
        background: none;
        color: $btn-secondary-color-LM;
        border: 1px solid $btn-border-color-LM;
      }

      .join-btn {
        background: $btn-primary-bg-color-LM;
        color: $btn-primary-color-LM;
      }

      .prize {
        color: $btn-prize-color-LM;
        background-color: $btn-prize-bg-color-LM;
        cursor: default;
        border: none;

        > img {
          max-width: 36px;
          height: 18px;
        }
      }
    }
  }
}
@media screen and (max-width: $tableWidth) {
  .achievements-card {

    .bottom-section {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .btn {
        font-size: 12px;

        > img {
          margin-right: 5px;
        }
      }
    }
  }
}
</style>