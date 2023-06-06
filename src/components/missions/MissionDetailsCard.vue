<template>
  <div v-if="cardItem" class="mission-details-card">
    <div class="mission-details-card__img">
      <img :src="banner" alt="">
    </div>
    <div v-if="cardItem" class="mission-data">
      <h2 class="mission-data__title">{{ cardItem?.name }}</h2>

      <div class="mission-data__description">
        <span class="description_title">Description </span>
        <span class="description_text">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</span>
      </div>
      <CButton v-if="!cardItem.entrantStatus" class="m-btn register-btn" @click="register">
        <span class="b-btn__text">Join</span>
      </CButton>
      <CButton v-if="cardItem.entrantStatus" class="m-btn register-btn" @click="openModal">
        <span class="b-btn__text">read more</span>
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
import { computed, ref } from 'vue';
import { CButton } from '@coreui/vue';
import banner from '../../assets/images/missions/mission-details.png';
import Modal from '../../shared/components/Modal';
import { useStore } from 'vuex';

const props = defineProps({
  mission: Object
});
const store = useStore();
const cardItem = computed(() => store.getters.getCurrentMission);

const emit = defineEmits(['joinMission', 'leaveMission']);

let leaveModal = ref(false);

const finish = () => {
  console.log('finish');
};

const register = () => {
  emit('joinMission');
};

const leave = () => {
  emit('leaveMission');
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
@import '@/assets/scss/_variables';

.mission-details-card {
  display: flex;
  max-width: 840px;
  background: $light-grey;
  overflow: hidden;
  border-radius: $border-radius;
  margin: 0 auto;
  padding: 14px 24px 26px;

  &__img {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;

    & > img {
      //width: 150px;
      //height: 150px;
    }
  }

  .mission-data {
    width: 70%;
    display: flex;
    flex-direction: column;
    padding: 20px 0 0 30px;

    &__title {
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: $main-text-color-white;
      text-align: start;
    }

    &__description {
      color: $main-text-color-white;
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      .description_title {
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        margin: 15px 0;
      }

      .description_text {
        font-weight: 400;
        font-size: 12px;
        line-height: 146.5%;
        text-align: start;
        margin-bottom: 20px;
      }
    }
  }

  .register-btn {
    align-self: flex-start;
    margin-bottom: 10px;
  }
}

//@media screen and (max-width: $smDesktopWidth) {
//  .mission-details-card {
//    flex-wrap: wrap;
//    width: 100%;
//
//    &__banner {
//      position: relative;
//      width: 100%;
//      border-radius: 30px 30px 0 0;
//      object-fit: cover;
//
//      & > img {
//        width: 100%;
//        height: 100%;
//      }
//
//      .status {
//        position: absolute;
//        top: 5px;
//        left: 5px;
//      }
//    }
//
//    .mission-data {
//      width: 100%;
//      padding: 5px 10px;
//
//      &__title {
//        font-weight: 600;
//        font-size: 18px;
//        line-height: 36px;
//        color: #FFFBFF;
//        text-align: start;
//      }
//
//      &__fund {
//        display: flex;
//        align-items: flex-start;
//        font-weight: 500;
//        font-size: 15px;
//        text-align: center;
//        color: #FFFFFF;
//
//        &__data {
//          & > img {
//            height: 50px;
//          }
//          &:last-child {
//            margin-left: 5px;
//          }
//        }
//      }
//
//      &__countadown {
//        max-width: 400px;
//        margin-top: 12px;
//      }
//
//      &__progress {
//        margin-top: 10px;
//      }
//
//      &__terms-and-conditions {
//        display: flex;
//        flex-direction: column;
//        margin-top: 15px;
//        padding-bottom: 10px;
//
//        &__title {
//          font-weight: 600;
//          font-size: 14px;
//          line-height: 21px;
//          color: #FFCC00;
//          text-align: start;
//        }
//
//        &__text {
//          font-weight: 500;
//          font-size: 8px;
//          line-height: 14px;
//          color: #FFFFFF;
//          text-align: start;
//        }
//      }
//    }
//    .progress {
//      width: 100%;
//      background: linear-gradient(180deg, #EDDFF3 0%, #E8EAEC 100%);
//      border-radius: 24px;
//
//      .progress-bar {
//        background: linear-gradient(180deg, #1ECE30 0%, #188A2A 100%);
//        box-shadow: inset 0 2.29752px 4.59504px rgba(255, 255, 255, 0.25), inset 0px -2.29752px 4.59504px rgba(0, 0, 0, 0.25);
//        border-radius: 4px;
//      }
//    }
//  }
//}
</style>