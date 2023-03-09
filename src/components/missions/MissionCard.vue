<template>
  <div class="mission-card">
    <div class="card-image">
      <img :src="cardImage" alt="">
    </div>
    <div class="mission-data">
      <h2 class="title">{{ missionItem.name }}</h2>
      <div class="prize-fund">
        <span><img :src="peopleIcon" alt=""> 100 </span>
        <span class="fund"><img :src="trophyIcon" alt=""> $1000 </span>
      </div>
      <div class="countdown-wrapper">
        <Countdown
            :date="missionItem.scheduling.endDate"
            :title="'Ends in'"
            :is-row="true"
            :is-small-size="true"
            @onFinish="finish()"
        />
      </div>
      <CProgress class="mission-progress" :height="13">
        <CProgressBar :value="missionItem.percentageComplete">{{ missionItem.percentageComplete }}%</CProgressBar>
      </CProgress>
      <router-link class="register-btn" :to="{
        name: 'MissionDetails',
        params: { id: missionItem.id }
      }">
        <CButton class="m-btn">
          <span class="b-btn__text">See More</span>
          <img src="../../assets/icons/button_icon.svg" alt="">
        </CButton>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { CProgress, CProgressBar, CButton } from '@coreui/vue';
import Countdown from '../Countdown';
import cardImage from '../../assets/images/world_cup.png';
import peopleIcon from '../../assets/icons/People.png';
import trophyIcon from '../../assets/icons/Trophy.png';

const props = defineProps({
  mission: Object
});
const missionItem = props.mission;

const finish = () => {
  console.log('finish');
};
</script>

<style lang="scss">
.register-btn {
  align-self: flex-end;
  margin-top: 10px;
}
</style>