<template>
  <div class="mission-card">
    <div class="card-image">
      <img :src="$options.cardImage" alt="">
    </div>
    <div class="mission-data">
      <h2 class="title">World Cup 2022 🏆</h2>
      <div class="prize-fund">
        <span><img :src="$options.peopleIcon" alt=""> 100 </span>
        <span class="fund"><img :src="$options.trophyIcon" alt=""> $1000 </span>
      </div>
      <Countdown
        :date="end"
        :title="'Ends in'"
        :is-row="true"
        :is-small-size="true"
        @onFinish="finish()"
      />
      <CProgress :height="13" >
        <CProgressBar :value="25" >25%</CProgressBar>
      </CProgress>
    </div>
  </div>
</template>

<script>
import { CProgress, CProgressBar } from '@coreui/vue';
import Countdown from './Countdown';
import cardImage from '../assets/images/world_cup.png'
import peopleIcon from '../assets/icons/People.png';
import trophyIcon from '../assets/icons/Trophy.png';
export default {
  name: 'MissionCard',
  cardImage,
  peopleIcon,
  trophyIcon,
  components: {
    CProgress,
    CProgressBar,
    Countdown
  },
  data () {
    return {
      end: new Date('2023-01-01T00:00:00')
    };
  },
  methods: {
    finish() {
      console.log('finish');
    }
  }
};
</script>

<style lang="scss">
.mission-card {
  position: relative;
  display: flex;
  background: #5951AA;
  border-radius: 16px;
  align-items: flex-start;
  padding-right: 50px;

  .card-image {
    width: 142px;
    height: 136px;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
    border-radius: 16px 0 0 16px;

    & > img {

    }
  }

  .mission-data {
    color: #FFFFFF;
    padding-left: 20px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 16px;
    padding-top: 13px;

    .title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #FFFBFF;
      text-align: start;
      margin: 0;
    }

    .prize-fund {
      display: flex;
      align-items: flex-start;

      .fund {
        margin-left: 5px;
      }
    }
  }

  .progress {
    width: 185px;
    background: linear-gradient(180deg, #EDDFF3 0%, #E8EAEC 100%);
    border-radius: 24px;

    .progress-bar {
      background: linear-gradient(180deg, #1ECE30 0%, #188A2A 100%);
      box-shadow: inset 0 2.29752px 4.59504px rgba(255, 255, 255, 0.25), inset 0px -2.29752px 4.59504px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
    }
  }
}
</style>