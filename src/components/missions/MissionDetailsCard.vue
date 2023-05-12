<template>
  <div v-if="cardItem" class="mission-details-card">
    <div class="mission-details-card__banner">
      <img :src="banner" alt="">
      <div class="status">
        <Status :status="cardItem.status" />
      </div>
    </div>
    <div v-if="cardItem" class="mission-data">
      <h2 class="mission-data__title">{{ cardItem?.name }}</h2>
      <div class="mission-data__fund">
        <div class="mission-data__fund__data"><img :src="peopleIcon" alt=""> 100 </div>
        <div class="mission-data__fund__data"><img :src="trophyIcon" alt=""> $1000 </div>
      </div>
      <div class="mission-data__countdown">
        <Countdown
          :date="cardItem.scheduling.endDate"
          :title="'Ends in'"
          :is-row="true"
          :is-big-size="true"
          :is-detail-card="true"
          @onFinish="finish()"
        />
      </div>
      <div class="mission-data__progress">
        <CProgress :height="23" >
          <CProgressBar :value="cardItem.percentageComplete" >{{ cardItem.percentageComplete }}%</CProgressBar>
        </CProgress>
      </div>
      <div class="mission-data__terms-and-conditions">
        <span class="mission-data__terms-and-conditions__title">Terms & Conditions Apply </span>
        <span class="mission-data__terms-and-conditions__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero</span>
      </div>
      <CButton v-if="!cardItem.entrantStatus" class="m-btn register-btn" @click="register">
        <span class="b-btn__text">Join</span>
      </CButton>
      <CButton v-if="cardItem.entrantStatus" class="m-btn register-btn" @click="openModal">
        <span class="b-btn__text">Leave</span>
      </CButton>
    </div>
  </div>
  <Modal
      :modalShow="leaveModal"
      :messageGeneral="'Are you sure you want to leave this mission?'"
      :title="'Leave the mission'"
      :successBtnLabel="'Leave'"
      @doFunction="leave"
      @closeModal="closeModal"
      v-on:toggle-modal="leaveModal = false"
  />
</template>

<script setup>
import { computed, ref, warn } from 'vue';
import { CProgress, CProgressBar, CButton } from '@coreui/vue';
import Countdown from '../Countdown';
import Status from '../../shared/components/Status';
import banner from '../../assets/images/world-cup.jpg';
import Modal from '../../shared/components/Modal'
import { useStore } from 'vuex';

const props = defineProps({
  mission: Object
})
const store = useStore()
const cardItem = computed(() => store.getters.getCurrentMission)

const emit = defineEmits(['joinMission', 'leaveMission'])

let leaveModal = ref(false)

const finish = () => {
  console.log('finish');
}

const register = () => {
  emit('joinMission')
}

const leave = () => {
  emit('leaveMission')
  leaveModal.value = false;
}

const openModal = () => {
  leaveModal.value = true;
}

const closeModal = () => {
  leaveModal.value = false;
}

</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.mission-details-card {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  position: relative;
  display: flex;
  max-width: 870px;
  background: $card-bg-gradient;
  overflow: hidden;
  border: 4px solid #9CA3DF;
  border-radius: 30px;

  &__banner {
    display: block;
    position: relative;
    width: 40%;
    border-radius: 30px 0 0 30px;

    & > img {
      width: 100%;
      height: 100%;
    }

    .status {
      position: absolute;
      top: 5px;
      left: 5px;
    }
  }

  .mission-data {
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 42px;

    &__title {
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #FFFBFF;
      text-align: start;
    }

    &__fund {
      display: flex;
      align-items: flex-start;
      font-weight: 600;
      font-size: 20px;
      text-align: center;
      color: #FFFFFF;

      &__data {
        & > img {
          height: 50px;
        }
        &:last-child {
          margin-left: 5px;
        }
      }
    }

    &__countadown {
      margin-top: 12px;
    }

    &__progress {
      margin-top: 12px;
    }

    &__terms-and-conditions {
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      padding-bottom: 40px;

      &__title {
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        color: #FFCC00;
        text-align: start;
      }

      &__text {
        font-weight: 500;
        font-size: 8px;
        line-height: 14px;
        color: #FFFFFF;
        text-align: start;
      }
    }
  }
  .progress {
    width: 400px;
    background: linear-gradient(180deg, #EDDFF3 0%, #E8EAEC 100%);
    border-radius: 24px;

    .progress-bar {
      background: linear-gradient(180deg, #1ECE30 0%, #188A2A 100%);
      box-shadow: inset 0 2.29752px 4.59504px rgba(255, 255, 255, 0.25), inset 0px -2.29752px 4.59504px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
    }
  }

  .register-btn {
    align-self: flex-end;
    margin-bottom: 10px;
  }
}
@media screen and (max-width: $smDesktopWidth) {
  .mission-details-card {
    flex-wrap: wrap;
    width: 100%;

    &__banner {
      position: relative;
      width: 100%;
      border-radius: 30px 30px 0 0;
      object-fit: cover;

      & > img {
        width: 100%;
        height: 100%;
      }

      .status {
        position: absolute;
        top: 5px;
        left: 5px;
      }
    }

    .mission-data {
      width: 100%;
      padding: 5px 10px;

      &__title {
        font-weight: 600;
        font-size: 18px;
        line-height: 36px;
        color: #FFFBFF;
        text-align: start;
      }

      &__fund {
        display: flex;
        align-items: flex-start;
        font-weight: 500;
        font-size: 15px;
        text-align: center;
        color: #FFFFFF;

        &__data {
          & > img {
            height: 50px;
          }
          &:last-child {
            margin-left: 5px;
          }
        }
      }

      &__countadown {
        max-width: 400px;
        margin-top: 12px;
      }

      &__progress {
        margin-top: 10px;
      }

      &__terms-and-conditions {
        display: flex;
        flex-direction: column;
        margin-top: 15px;
        padding-bottom: 10px;

        &__title {
          font-weight: 600;
          font-size: 14px;
          line-height: 21px;
          color: #FFCC00;
          text-align: start;
        }

        &__text {
          font-weight: 500;
          font-size: 8px;
          line-height: 14px;
          color: #FFFFFF;
          text-align: start;
        }
      }
    }
    .progress {
      width: 100%;
      background: linear-gradient(180deg, #EDDFF3 0%, #E8EAEC 100%);
      border-radius: 24px;

      .progress-bar {
        background: linear-gradient(180deg, #1ECE30 0%, #188A2A 100%);
        box-shadow: inset 0 2.29752px 4.59504px rgba(255, 255, 255, 0.25), inset 0px -2.29752px 4.59504px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
      }
    }
  }
}
</style>