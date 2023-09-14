<template>
  <h1 class="page-title">Dashboard</h1>
  <GradientProgress
      class="main-progress"
      :diameter="state.diameter"
      :completed-steps="completedSteps"
      :total-steps="totalSteps"
      :stroke-width="state.strokeWidth"
      :inner-stroke-width="state.strokeWidth"
      :start-color="'#41b2a1'"
      :stop-color="'#199fc7'"
      :inner-stroke-color="innerStrokeColor"
      :stroke-linecap="state.strokeLinecap"
  >
    <p class="progress-value" :class="{'light-mode': !isDarkMode}">{{ completedSteps }}%</p>
    <p class="progress-title" :class="{'light-mode': !isDarkMode}">percentage off</p>
  </GradientProgress>

  <div class="congratulations-wrapper">
    <div class="congratulations">
      <img src="@/assets/icons/dashboard/awards.svg" alt="">
      <div class="congratulations-text">Congratulations on being one of our top drivers this week! Well done!</div>
    </div>
  </div>

  <div class="progress">
    <div class="declared-mileage">
      <div class="declared-mileage-title">Declared mileage</div>
      <GradientProgress
          :diameter="51"
          :completed-steps="80"
          :total-steps="100"
          :stroke-width="4"
          :inner-stroke-width="4"
          :start-color="'#41b2a1'"
          :stop-color="'#199fc7'"
          :inner-stroke-color="innerStrokeColor"
          :stroke-linecap="state.strokeLinecap"
      >
        <p class="progress-value" :class="{'light-mode': !isDarkMode}">{{ completedSteps }}%</p>
      </GradientProgress>
      <div class="declared-mileage-description">declared mileage remaining</div>
    </div>

    <div class="your-driving">
      <div class="your-driving-title">Your driving</div>
      <div class="your-driving-description">Gold</div>
      <img src="@/assets/icons/dashboard/chart.svg" alt="">
    </div>
  </div>

</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import GradientProgress from 'vue3-radial-progress';

const store = useStore();
const isClientConnected = computed(() => store.getters.getIsConnectedClient);

const state = reactive({
  diameter: 220,
  strokeWidth: 15,
  strokeLinecap: 'round',
});

const totalSteps = ref(100)
const completedSteps = ref(84)
const innerStrokeColor = ref()
const color = ref()

</script>

<style lang="scss" scoped>
@import '../assets/scss/utils/vars';

.page-title {
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  color: var(--dark-grey-800, #253241);
  text-align: left;
}

.main-progress {
  margin: 30px auto;
}

.congratulations-wrapper {
  width: 100%;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #F0047E;

  .congratulations {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: #FFE6F3;
    display: flex;
    align-items: center;

    .congratulations-text {
      padding: 5px 8px;
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      color: #202B38;
      text-align: left;
    }
  }
}

.progress {
  margin-top: 40px;
  width: 100%;
  height: auto;
  display: grid;
  gap: 15px;
  grid-template-columns: 50% 50%;
  background: none;


  .declared-mileage {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    background: #EFF2F6;
    padding: 8px;

    .declared-mileage-title {
      width: 100%;
      text-align: left;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      color: #202B38;
    }

    .declared-mileage-description {
      width: 70%;
      color: #253241;
      text-align: center;

      font-size: 10px;
      font-style: normal;
      font-weight: 600;
    }
  }

  .your-driving {
    background: #EFF2F6;
    padding: 8px;
    border-radius: 10px;

    .your-driving-title {
      color: #202B38;
      text-align: left;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }

    .your-driving-description {
      color: #253241;
      text-align: left;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
    }
  }
}


.info-container {
  display: flex;
  width: 100%;

  .charts-container {
    padding: 0 20px;

    .starts-in-cards {
      display: flex;
      justify-content: space-between;
      padding-bottom: 18px;
    }
  }
}
@media screen and (max-width: 850px) {
  .info-container {
    flex-wrap: wrap;
    justify-content: center;

    .charts-container {
      padding: 10px 0 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .starts-in-cards {
        width: 90%;
        padding-bottom: 10px;
      }
      .instant-rewards-chances-card-wrapper {
        width: 90%;
      }
    }
  }
}
@media screen and (max-width: $phoneWidth) {
  .info-container {
    flex-wrap: wrap;
    justify-content: center;

    .charts-container {
      padding: 10px 0 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .starts-in-cards {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .instant-rewards-chances-card-wrapper {
        width: 100%;
      }
    }
  }
}
</style>