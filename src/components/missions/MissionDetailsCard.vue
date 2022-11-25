<template>
  <div class="mission-details-card">
    <div class="mission-details-card__banner">
      <img :src="$options.banner" alt="">
      <div class="status">
        <Status :status="'Active'" />
      </div>
    </div>
    <div class="mission-data">
      <h2 class="mission-data__title">World Cup 2022 🏆</h2>
      <div class="mission-data__fund">
        <div class="mission-data__fund__data"><img :src="$options.peopleIcon" alt=""> 100 </div>
        <div class="mission-data__fund__data"><img :src="$options.trophyIcon" alt=""> $1000 </div>
      </div>
      <div class="mission-data__countdown">
        <Countdown
            :date="end"
            :title="'Ends in'"
            :is-row="true"
            :is-big-size="true"
            :is-detail-card="true"
            @onFinish="finish()"
        />
      </div>
      <div class="mission-data__progress">
        <CProgress :height="23" >
          <CProgressBar :value="25" >25%</CProgressBar>
        </CProgress>
      </div>
      <div class="mission-data__terms-and-conditions">
        <span class="mission-data__terms-and-conditions__title">Terms & Conditions Apply </span>
        <span class="mission-data__terms-and-conditions__text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero</span>
      </div>
    </div>
  </div>
</template>

<script>
import { CProgress, CProgressBar } from '@coreui/vue';
import Countdown from '../Countdown';
import Status from '../../shared/components/Status';
import banner from '../../assets/images/world_cup.png';
import peopleIcon from '../../assets/icons/People.png';
import trophyIcon from '../../assets/icons/Trophy.png';
export default {
  name: 'MissionDetailsCard',
  banner,
  peopleIcon,
  trophyIcon,
  components: {
    CProgress,
    CProgressBar,
    Status,
    Countdown
  },
  data () {
    return {
      end: new Date('2023-01-01T00:00:00'),
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
.mission-details-card {
  position: relative;
  display: flex;
  max-width: 870px;
  max-height: 290px;
  background: #5D53C2;
  overflow: hidden;
  border: 4px solid #9CA3DF;
  border-radius:30px;

  &__banner {
    position: relative;
    height: 290px;
    width: 310px;
    object-fit: cover;
    & > img {
      width: inherit;
      height: inherit;
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
    width: 45%;
    padding: 20px 0 0 42px;

    &__title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #FFFBFF;
      text-align: start;
    }

    &__fund {
      display: flex;
      align-items: flex-start;
      font-family: 'Poppins';
      font-style: normal;
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
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        color: #FFCC00;
        text-align: start;
      }

      &__text {
        font-family: 'Poppins';
        font-style: normal;
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
}
</style>