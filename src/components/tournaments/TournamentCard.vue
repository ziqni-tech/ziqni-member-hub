<template>
  <div class="tournament-card">
    <div class="status">
      <Status :status="cardItem.status" />
    </div>
    <div class="left">
      <div class="logo-casino">
        <img :src="$options.candyImg" alt="">
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
          <img :src="$options.cupImg" alt="">
        </div>
      </div>
      <router-link :to="{name: 'TournamentDetails', params: {
          id: cardItem.id,
        }}">
        <CButton class="btn">
          <span class="btn__text">See More</span>
          <img :src="$options.btnIcon" alt="">
        </CButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import { CButton } from '@coreui/vue';
import Countdown from '../Countdown';
import candyImg from '../../assets/images/candy.png';
import cupImg from '../../assets/images/mini_cup.png';
import btnIcon from '../../assets/icons/button_icon.svg';
import Status from '../../shared/components/Status';

export default {
  name: 'TournamentCard',
  candyImg,
  btnIcon,
  cupImg,
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
.tournament-card {
  position: relative;
  display: flex;
  padding: 20px 15px 24px 30px;
  background: linear-gradient(180deg, #574FA3 0%, #5D53C2 100%);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  margin-bottom: 20px;

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

    & > a {
      text-decoration: none;
    }

    .main-data {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      &__title {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #FFFBFF;
      }

      &__rate {
        font-family: 'Poppins';
        font-style: normal;
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
          font-family: 'Poppins';
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          color: #E4E4E4;
        }

        &__price {
          font-family: 'Poppins';
          font-style: normal;
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

    .btn {
      display: flex;
      align-items: center;
      padding: 13px 28px 13px 26px;
      gap: 8px;

      width: 156px;
      height: 52px;

      background: #F6876A;
      border-radius: 5px;
      &__text {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 15px;
        line-height: 22px;
        display: flex;
        align-items: center;
        color: #FFFFFF;
      }
      & > img {
        margin-left: 18px;
      }
    }
  }
}
</style>