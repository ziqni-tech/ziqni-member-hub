<template>
  <div class="notifications-block" :class="{'light-mode': !isDarkMode}">
    <div class="notifications-block_header">
      <div class="close-btn" @click="closeNotifications">
        <ArrowLeft :strokeColor="getIconStrokeColor()"/>
      </div>
    </div>
    <div class="notifications-block_list">
      <CNav
          variant="pills"
          layout="fill"
          class="scores-tabs"
          :class="{'light-mode': !isDarkMode}"
      >
        <CNavLink
            :active="activeTabKey === 'scores'"
            @click="() => updateActiveTab('scores')"
        >
          Scores
        </CNavLink>
        <CNavLink
            :active="activeTabKey === 'journeys'"
            @click="() => updateActiveTab('journeys')"
        >
          Journeys
        </CNavLink>
      </CNav>
      <div class="items">
        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/speed.svg" alt="">
            <span>Speeding</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">90</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/accidents.svg" alt="">
            <span>Tail gating</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">70</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/car-forward.svg" alt="">
            <span>Lane departure</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">75</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/flash.svg" alt="">
            <span>ADAS reaction</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">85</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/car.svg" alt="">
            <span>Erratic driving</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">90</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/sun-fog.svg" alt="">
            <span>Time of the day</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">86</span>
            <span class="points-total"> /100</span>
          </div>
        </div>

        <div class="score-item">
          <div class="score-item-name">
            <img src="@/assets/icons/scores/clock.svg" alt="">
            <span>Driving duration</span>
          </div>
          <div class="score-item-data">
            <span class="points-scored">99</span>
            <span class="points-total"> /100</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import ArrowLeft from '@/shared/components/svg-icons/ArrowLeft.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import { CNav, CNavLink } from '@coreui/vue';

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const emit = defineEmits(['closeNotifications']);

const updateActiveTab = (val) => {
  store.dispatch('setCurrentTab', val);
};

const activeTabKey = computed(() => store.getters.getCurrentTab.length
    ? store.getters.getCurrentTab
    : 'scores');

const closeNotifications = () => {
  emit('closeNotifications');
};

const getIconStrokeColor = () => {
  return isDarkMode.value ? '#FFFFFF' : '#080D12';
};

</script>

<style scoped lang="scss">
@import "src/assets/scss/_variables";

.notifications-block {
  display: flex;
  flex-direction: column;
  background-color: $secondary-bg-DM;
  width: 100%;
  height: 100%;
  padding: 0 12px;

  &_header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 0;

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
      border: 1px solid rgba(230, 230, 230, 0.20);
      width: 40px;
      height: 40px;
    }
  }

  &_list {
    display: flex;
    flex-direction: column;
    padding: 2px 0;
    align-items: flex-start;

    .scores-tabs {
      width: 400px;
      max-width: 90%;
      display: flex;
      align-items: center;
      background-color: #E8F8FC;
      color: #253241;
      border-radius: $border-radius;
      margin: 0 auto;
      font-family: $medium;
      font-size: 12px;


      .notifications-block_list .scores-tabs.light-mode {
        background-color: #E8F8FC;
      }

      .nav-link {
        color: #253241;
      }

      .nav-pills .nav-link.active {
        background: $pagination-active-btn-bg;
      }

      @media screen and (max-width: 480px) {
        margin-bottom: 20px;
      }

      @media screen and (max-width: 380px) {
        width: 280px;
        margin-bottom: 20px;
      }

      &.light-mode {
        background-color: #E8F8FC;
      }
    }

    .nav-pills .nav-link.active {
      background: $pagination-active-btn-bg;
      color: white;
    }

    .light-mode .nav-pills .nav-link.active {
      background: $pagination-active-btn-bg;
      color: white;
    }

    .title {
      font-size: 20px;
      font-family: $bold;
      color: $white-color-DM;
      padding-bottom: 20px;
    }

    .items {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      height: 100vh;
      overflow-y: scroll;

      .score-item {
        display: flex;
        align-items: center;
        padding: 7px 14px;
        border-radius: 10px;
        background: #EFF2F6;
        width: 100%;
        justify-content: space-between;

        &:not(:last-child) {
          margin-bottom: 10px;
        }

        .score-item-name {
          color: #253241;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;

          & > img {
            margin-right: 10px;
          }
        }

        .score-item-data {
          display: flex;
          align-items: center;

          .points-scored {
            color: #253241;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
          }
          .points-total {
            color: #253241;

            font-size: 12px;
            font-style: normal;
            font-weight: 400;
          }
        }
      }

      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }

  &.light-mode {
    background-color: $bg-secondary-LM;

    .notifications-block_header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 12px;

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 1px solid #B9CEDF;
        width: 40px;
        height: 40px;
      }
    }

    .notifications-block_list {
      display: flex;
      flex-direction: column;
      padding: 2px 12px;
      align-items: flex-start;

      .title {
        font-size: 20px;
        font-family: $bold;
        color: $section-title-color-LM;
      }
    }
  }
}
</style>