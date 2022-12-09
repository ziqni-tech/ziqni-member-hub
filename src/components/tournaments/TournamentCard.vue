<template>
  <div class="tournament-card">
    <div class="status">
      <Status :status="cardItem.status" />
    </div>
    <div class="left">
      <div class="logo-casino">
        <img src="../../assets/images/candy.png" alt="">
      </div>
      <Countdown
        :date="cardItem.scheduledEndDate"
        :title="'Ends in'"
        :is-row="true"
        :is-medium-size="true"
        @onFinish="finish()"
      />
    </div>
    <div class="tournament-data">
      <div class="main-data">
        <span class="main-data__title">{{ cardItem.name }} 😝</span>
        <span class="main-data__rate">RTP: 84% 💎 Rate: 4.9 ✨</span>
      </div>
      <div class="prize">
        <div class="prize_data">
          <span class="prize_data__title">1st Prize</span>
          <span class="prize_data__price">$ 1,500</span>
        </div>
        <div class="prize_img">
          <img src="../../assets/images/mini_cup.png" alt="">
        </div>
      </div>
      <router-link :to="{name: 'TournamentDetails', params: {
          id: cardItem.id,
        }}">
        <CButton class="b-btn">
          <span class="b-btn__text">See More</span>
          <img src="../../assets/icons/button_icon.svg" alt="">
        </CButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import { CButton } from '@coreui/vue';
import Countdown from '../Countdown';
import Status from '../../shared/components/Status';

export default {
  name: 'TournamentCard',
  components: {
    Status,
    Countdown,
    CButton
  },
  props: {
    card: Object
  },
  data () {
    return {
      end: new Date('2023-01-01T00:00:00'),
      cardItem: null
    };
  },
  created() {
    this.cardItem = this.card;
  },
  methods: {
    finish() {
      console.log('finish');
    }
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/utils/vars';

.tournament-card {
  font-family: $mainFont;
  font-style: normal;
  position: relative;
  display: flex;
  padding: 20px 15px 24px 30px;
  background: $card-bg-gradient;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  margin-bottom: 20px;
  margin-right: 30px;

  @media screen and (max-width: $phoneWidth){
    padding: 10px 7px 10px 15px;
    margin-bottom: 10px;
    margin-right: 0;
  }

  .status {
    position: absolute;
    top: 0;
    left: 0;
  }

  .left {
    display: flex;
    flex-direction: column;

    .logo-casino {
      width: 196px;
      height: 134px;
      margin-bottom: 15px;
      background: #3c3a62;
      border-radius: 10px;
      padding: 15px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .tournament-data {
    display: flex;
    flex-direction: column;
    padding-left: 25px;
    max-width: 183px;
    @media screen and (max-width: $phoneWidth){
      padding-left: 12px;
    }

    .main-data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      &__title {
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #FFFBFF;
        max-width: 158px;
        min-width: 158px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: start;

        @media screen and (max-width: $phoneWidth) {
          font-weight: 600;
          font-size: 14px;
          max-width: 145px;
          min-width: 145px;
        }
      }

      &__rate {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        color: #E4E4E4;
      }
    }

    .prize {
      display: flex;
      align-items: center;
      margin: 12px 0 20px;

      .prize_data {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &__title {
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          color: #E4E4E4;
        }

        &__price {
          font-weight: 700;
          font-size: 20px;
          line-height: 30px;
          color: #FFFFFF;
        }
      }

      .prize_img {
        width: 55px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        object-fit: cover;
        padding-left: 20px;
      }
    }
  }
}
</style>