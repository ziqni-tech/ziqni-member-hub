<template>
  <div class="tournament-details-card">
    <div class="card-banner">
      <div class="tournament-main-data">
        <span class="tournament-title">{{ tournament?.name }}</span>
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
        <InfoItem :icon="prizeIcon" :title="'prize'" :data="'2000'"/>
        <InfoItem :icon="rtpIcon" :title="'RTP'" :data="'84%'"/>
        <InfoItem :icon="rateIcon" :title="'rate'" :data="'4.9'"/>
      </div>

      <div class="tournament-description">
        <h5 class="tournament-description_title">description</h5>
        <p class="tournament-description_description">Amet minim mollit non deserunt ullamco est sit aliqua dolor do
          amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud
          amet.</p>
      </div>

      <CButton v-if="!isEntrant" class="m-btn register-btn" @click="join">
        <span class="b-btn__text">Join</span>
      </CButton>
      <CButton v-else class="m-btn register-btn" @click="openModal">
        <span class="b-btn__text">Leave</span>
      </CButton>
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
import { CButton } from '@coreui/vue';
import { ref } from 'vue';

import Countdown from '../Countdown';
import { useMedia } from '@/hooks/useMedia';
import Modal from '../../shared/components/Modal';
import InfoItem from '../../shared/components/InfoItem';

import cardImage from '../../assets/images/tournaments/tournament.png';
import prizeIcon from '@/assets/icons/tournament/details/prize.png';
import rtpIcon from '@/assets/icons/tournament/details/rtp.png';
import rateIcon from '@/assets/icons/tournament/details/rate.png';

const props = defineProps({ tournament: Object });
const emit = defineEmits(['joinTournament', 'leaveTournament']);
const end = new Date('2023-01-01T00:00:00');
const isMobile = useMedia('(max-width: 480px)');
let leaveModal = ref(false);
const isEntrant = props.tournament.entrantStatus === 'Entrant' || props.tournament.entrantStatus === 'Entering';

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

const openModal = () => {
  leaveModal.value = true;
};

const closeModal = () => {
  leaveModal.value = false;
};
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.tournament-details-card {
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  background-color: $light-grey;
  border-radius: $border-radius;
  overflow: hidden;
  font-style: normal;

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
      color: $main-text-color-white;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 30px;
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
    padding: 20px 44px;

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
      color: $main-text-color-white;
      text-align: start;

      &_title {
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
      }

      &_description {
        margin: 15px 0 20px;
        font-weight: 500;
        font-size: 12px;
        line-height: 16px;
      }
    }

    .register-btn {
      border-radius: $border-radius;
      width: 35%;
      padding: 10px 0;
      margin-top: auto;
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
        color: $main-text-color-white;
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
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
      padding: 20px 44px;

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
        color: $main-text-color-white;
        text-align: start;

        &_title {
          font-weight: 700;
          font-size: 12px;
          line-height: 14px;
        }

        &_description {
          margin: 10px 0 20px;
          font-weight: 500;
          font-size: 10px;
          line-height: 12px;
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