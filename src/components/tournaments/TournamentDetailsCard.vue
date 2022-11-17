<template>
  <div class="tournament-details-card">
    <div class="card-banner">
      <img :src="$options.banner" alt="">
    </div>
    <div class="tournament-data">
      <div class="main-data">
        <span class="main-data__title">Candy Stars 😝</span>
        <span class="main-data__rate">RTP: 84% 💎 Rate: 4.9 ✨</span>
      </div>
      <div class="prize">
        <div class="prize_data">
          <span class="prize_data__title">1st Prize</span>
          <span class="prize_data__price">$ 1,500</span>
        </div>
        <div class="prize_img">
          <img :src="$options.cupImg" alt="">
        </div>
      </div>
      <Countdown
          :date="end"
          :title="'Ends in'"
          :is-row="true"
          :is-detail-card="true"
          @onFinish="finish()"
      />
    </div>
  </div>
</template>

<script>
import { CButton } from '@coreui/vue';
import banner from '../../assets/images/CandyStars-Banner.png';
import cupImg from '../../assets/images/mini_cup.png';
import btnIcon from '../../assets/icons/button_icon.svg';
import Status from '../../shared/components/Status';
import Countdown from '../Countdown';

export default {
  name: 'TournamentDetailsCard',
  banner,
  cupImg,
  btnIcon,
  components: {
    CButton,
    Status,
    Countdown,
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
.tournament-details-card {
  position: relative;
  display: flex;
  max-width: 1030px;
  max-height: 290px;
  background: #5D53C2;
  border-radius: 12px;
  overflow: hidden;

  .card-banner {

  }

  .tournament-data {
    display: flex;
    flex-direction: column;
    width: 45%;
    padding-top: 20px;
    padding-left: 125px;

    .main-data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      &__title {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        color: #FFFBFF;
      }

      &__rate {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #E4E4E4;
      }
    }

    .prize {
      display: flex;
      align-items: center;
      margin: 13px 0 20px;

      .prize_data {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &__title {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 500;
          font-size: 19px;
          line-height: 28px;
          color: #E4E4E4;
        }

        &__price {
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 700;
          font-size: 26px;
          line-height: 40px;
          color: #FFFFFF;
        }
      }

      .prize_img {
        width: 73px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        padding-left: 20px;

        & > img {
          width: inherit;
          height: inherit;
        }
      }
    }
  }
}
</style>