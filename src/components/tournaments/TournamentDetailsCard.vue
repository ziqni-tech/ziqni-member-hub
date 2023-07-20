<template>
  <div class="tournament-details-card" :class="{'light-mode': !isDarkMode}">
    <div class="card-banner">
      <div class="tournament-main-data">
        <span class="tournament-title">{{ tournament.name }}</span>
        <Countdown
          v-if="tournament && tournament.scheduledEndDate"
          :date="tournament.scheduledEndDate"
          class="countdown"
        />
      </div>
      <img :src="cardImage" alt="">
    </div>
    <div class="tournament-data-wrapper">
      <div class="tournament-info-grid">
        <InfoItem
            :icon="TrophyIcon"
            :title="'prize'"
            :data="tournament.rewardValue"
            :isDarkMode="isDarkMode"
        />
        <InfoItem
            :icon="DiamondIcon"
            :title="'RTP'"
            :data="'84%'"
            :isDarkMode="isDarkMode"
        />
        <InfoItem
            :icon="StarIcon"
            :title="'rate'"
            :data="'4.9'"
            :isDarkMode="isDarkMode"
        />
        <button
            class="info_btn"
            @click="goToInfo"
            title="show terms and conditions"
        >
          i
        </button>
      </div>
      <div class="tournament-description">
        <h5 class="tournament-description_title">{{ 'Description' }}</h5>
        <p class="tournament-description_description">{{ removeHTMLTags(description) }}</p>
      </div>

      <div class="tournament-description" v-if="isTermsAndConditions">
        <h5 class="tournament-description_title">{{ 'Terms and conditions' }}</h5>
        <p class="tournament-description_description">{{ removeHTMLTags(termsAndConditions) }}</p>
      </div>
      <button
          class="m-btn register-btn"
          @click="handleButtonClick"
          :class="{ 'join-button': !isEntrant, 'leave-button': isEntrant }"
      >
        <CSpinner v-if="isLoading" grow size="sm"/>
        <span v-else >{{ isEntrant ? 'Leave' : 'Join' }}</span>
      </button>
    </div>
  </div>
  <Modal
    :modalShow="leaveModal"
    :messageGeneral="'Are you sure you want to leave this tournament?'"
    :title="'Leave the tournament'"
    :successBtnLabel="'Leave'"
    @doFunction="leave"
    @closeModal="closeModal"
    v-on:toggle-modal="leaveModal = false"
  />
</template>

<script setup>
import { CSpinner } from '@coreui/vue';
import { computed, ref, toRef } from 'vue';

import Countdown from '../Countdown';
import Modal from '../../shared/components/Modal';
import InfoItem from '../../shared/components/InfoItem';

import cardImage from '../../assets/images/tournaments/tournament.png';
import TrophyIcon from "@/shared/components/svg-icons/TrophyIcon.vue";
import DiamondIcon from "@/shared/components/svg-icons/DiamondIcon.vue";
import StarIcon from "@/shared/components/svg-icons/StarIcon.vue";
import { removeHTMLTags } from '@/utils/removeHTMLTags';

const props = defineProps({ tournament: Object, isDarkMode: Boolean });
const emit = defineEmits(['joinTournament', 'leaveTournament']);

const tournament = toRef(props, 'tournament');

const leaveModal = ref(false);
const isLoading = ref(false);
const isTermsAndConditions = ref(false);

const description = computed(() => {
  return tournament.value.description
      ? tournament.value.description
      : 'Description not specified';
})

const termsAndConditions = computed(() => {
  return tournament.value.termsAndConditions
      ? tournament.value.termsAndConditions
      : 'Terms and conditions are not specified';
})

const isEntrant = computed(() => {
  const entrantStatus = tournament.value.entrantStatus;
  isLoading.value = false;
  return entrantStatus === 'Entrant' || entrantStatus === 'Entering';
});

const finish = () => {
  console.log('finish');
};

const join = () => {
  emit('joinTournament');
};

const leave = () => {
  emit('leaveTournament');
  leaveModal.value = false;
};

const closeModal = () => {
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
  isTermsAndConditions.value = !isTermsAndConditions.value;
}
</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.tournament-details-card {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-height: 92vh;
  overflow-y: auto;
  background-color: $light-grey;
  border-radius: $border-radius;
  font-family: $semi-bold;

  &::-webkit-scrollbar {
    width: 4px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #262a3a;
  }

  .card-banner {
    position: relative;
    border-radius: $border-radius $border-radius 0 0;

    width: 100%;
    height: 35%;

    .tournament-main-data {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .tournament-title {
      color: $text-color-white-LM;
      font-size: 20px;
      font-family: $bold;
      margin: 30px 0;
    }

    .countdown {
      width: 50%;
      color: $text-color-white-LM;

      .indicator {
        .indicator-block {
          .indicator-block_digits {
            font-family: $bold;
            font-size: 24px;
          }
          .indicator-block_text {
            font-family: $medium;
            font-size: 12px;
          }
        }
      }

      .title-medium {
        max-width: 100px;
        padding-bottom: 10px;
        margin-right: 65px;
      }
    }
  }

  .join-button {
    background: $purple-gradient;
    border: 1px solid $purple;
  }

  .leave-button {
    border: 1px solid $border-dark;
    background: $btn-grey;
  }

  .tournament-data-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 20px 29px;

    .tournament-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      grid-gap: 15px;
      padding: 20px 0;
      margin-top: 25px;
      position: relative;

      .info_btn {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $border-radius-sm;
        background: none;
        border: 1px solid $dark-blue;
        color: $text-color-white;

        position: absolute;
        bottom: -20px;
        right: 0;
        z-index: 3;
      }
    }

    .tournament-description {
      display: flex;
      flex-direction: column;
      color: $text-color-white;
      text-align: start;
      width: 100%;

      &_title {
        font-size: 16px;
        font-family: $bold;
      }

      &_description {
        margin: 15px 0 20px;
        font-family: $medium;
        font-size: 12px;
      }
    }

    .register-btn {
      border-radius: $border-radius;
      width: 35%;
      padding: 10px 0;
    }
  }

  &.light-mode {
    background-color: $card-bg-LM;
    border-radius: $border-radius;

    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #262a3a;
    }

    .card-banner {
      .tournament-title {
        color: $text-color-white-LM;
        font-size: 20px;
        margin: 30px 0;
      }
    }

    .join-button {
      background: $btn-primary-bg-color-LM;
      border: 1px solid $btn-border-color-LM;
      font-size: 14px;
      font-family: $bold;
    }

    .leave-button {
      border: 1px solid $btn-border-color-LM;
      background: none;
      color: $btn-secondary-color-LM;
      font-size: 14px;
      font-family: $bold;
    }

    .tournament-data-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 20px 29px;

      .tournament-info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        grid-gap: 15px;
        padding: 20px 0;
        margin-top: 25px;
        position: relative;

        .info_btn {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: $border-radius-sm;
          background: none;
          border: 1px solid $main-border-color-LM;
          color: $btn-prize-color-LM;

          position: absolute;
          bottom: -20px;
          right: 0;
          z-index: 3;
        }
      }

      .tournament-description {
        display: flex;
        flex-direction: column;
        text-align: start;
        width: 100%;

        &_title {
          font-size: 16px;
          color: $section-title-color-LM;
          font-family: $bold;
        }

        &_description {
          margin: 15px 0 20px;
          font-family: $medium;
          font-size: 12px;
          color: $card-title-color-LM;
        }
      }

      .register-btn {
        border-radius: $border-radius;
        width: 35%;
        padding: 10px 0;
      }
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .tournament-details-card {
    position: relative;
    display: flex;
    flex-direction: column;

    width: 100%;
    background-color: $light-grey;
    border-radius: $border-radius;
    overflow: hidden;
    font-style: normal;
    max-height: 100%;

    .card-banner {
      position: relative;
      border-radius: $border-radius $border-radius 0 0;

      width: 100%;
      height: 35%;

      .tournament-main-data {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .tournament-title {
        color: $text-color-white;
        font-size: 22px;
        margin-bottom: 14px;
      }

      .countdown {
        width: 50%;

        .title-medium {
          max-width: 100px;
          padding-bottom: 10px;
          margin-right: 65px;
        }
      }
    }

    .register-btn {
      border-radius: $border-radius;
      width: 35%;
      padding: 10px 0;
      margin-top: auto;
    }

    .tournament-data-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 20px 22px;

      .tournament-info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        grid-gap: 15px;
        padding: 20px 0;
        margin-top: 25px;
      }

      .tournament-description {
        display: flex;
        flex-direction: column;
        color: $text-color-white;
        text-align: start;

        &_title {
          font-weight: 700;
          font-size: 16px;
          line-height: 14px;
        }

        &_description {
          margin: 10px 0 20px;
          font-size: 16px;
        }
      }

      .register-btn {
        border-radius: $border-radius;
        width: 35%;
        padding: 10px 0;
        margin-top: auto;

        font-weight: 700;
        font-size: 12px;
        line-height: 14px;
      }
    }
  }
}
</style>