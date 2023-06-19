<template>
  <div class="achievements-details-card">
    <div class="title">
      {{ achievement.name }}
    </div>
    <div class="icon">
      <img :src="defaultIcon" alt="">
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
    <div class="description">
      <span class="description-title">Description</span>
      <span class="description-value">
        {{ achievement.description ? achievement.description : testDescription }}
      </span>
    </div>
    <div class="bottom-section">
      <div class="prize-btn">
        <img src="@/assets/icons/achievements/diamond.png" alt="">
        1000
      </div>
      <button
          v-if="!isCompleted"
          class="action-btn"
          @click="handleButtonClick"
          :disabled="isLoading"
          :class="{ 'disabled-btn': isLoading }"
      >
        <CSpinner v-if="isLoading" grow size="sm"/>
        <span v-else>{{ isEntrant ? 'Leave' : 'Join' }}</span>
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

import defaultIcon from '@/assets/icons/achievements/book.png';
import { ref, toRef, watch } from 'vue';
import Modal from '@/shared/components/Modal.vue';
import { CSpinner } from '@coreui/vue';

const props = defineProps({
  achievement: Object
});

const emit = defineEmits(['joinAchievement', 'leaveAchievement']);

const achievement = toRef(props, 'achievement');
const isEntrant = ref(achievement.value.entrantStatus === 'Entrant' || achievement.value.entrantStatus === 'Entering');
const isCompleted = ref(achievement.value.entrantStatus === 'Completed');
const isLoading = ref(false);

watch(achievement, (newVal) => {
  isEntrant.value = newVal.entrantStatus === 'Entrant' || newVal.entrantStatus === 'Entering';
  isLoading.value = false;
});

const testDescription = ref('Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.');
const leaveModal = ref(false);
const closeModal = () => {
  leaveModal.value = false;
};

const join = () => {
  emit('joinAchievement', {id: achievement.value.id, name: achievement.value.name});
};

const leave = () => {
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

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

.achievements-details-card {
  max-width: 840px;
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;


  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $text-color-white;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 30px;
  }

  .icon {
    width: 100px;
    height: 100px;
    padding-top: 20px;

    > img {
      width: inherit;
      height: inherit;
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
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
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
          background: $purple-gradient;
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
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .description-value {
      text-align: start;
      width: 100%;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
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

      background: $purple-gradient;
      border-radius: 10px;
      border: 1px solid $purple;
      color: $text-color-white;
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

      background: $dark-grey;
      border-radius: 10px;
      border: 1px solid $dark-grey;
      color: $text-color-white;

      > img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }
  }

}
</style>