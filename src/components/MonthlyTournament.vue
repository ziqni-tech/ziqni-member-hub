<template>
  <CCard class="monthly-tournament-card">
    <CCardBody class="monthly-tournament-card-body">
      <div class="content-wrapper">
        <div class="card-content">
          <img :src="$options.dragonTitleImg" alt="">
          <div>
            <div class="prize">9000&#8364;</div>
            <span class="tournament-title">Monthly Tournament</span>
          </div>
          <Countdown :date="end" @onFinish="finish()" />
          <CButton class="register-btn">Register</CButton>
        </div>
        <CCardImage class="card-image" :src="$options.dragonImg" />
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody, CCardImage, CButton } from '@coreui/vue'
import dragonImg from '../assets/images/floating-dragon.png';
import dragonTitleImg from '../assets/images/floating-dragon-title.svg';
import Countdown from './Countdown';
export default {
  name: 'MonthlyTournament',
  dragonImg,
  dragonTitleImg,
  components: {
    CCard,
    CCardBody,
    CCardImage,
    CButton,
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
.monthly-tournament-card {
  width: 360px;
  height: 454px;
  border-radius: 14px;
  overflow: hidden;

  .monthly-tournament-card-body {
    padding: 0;
  }

  .content-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, #423997 7.27%, #5D53C2 36.25%, rgba(69, 64, 123, 0) 100%);
    }
    .card-image {
      width: 100%;
      height: 102%;
      object-fit: cover;
    }
    .card-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      color: #FFFFFF;
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 16px 10px 41px;

      .prize {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 39px;
        line-height: 52px;
        text-align: center;
        color: #FFFFFF;
      }

      .tournament-title {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-size: 19px;
        line-height: 26px;
        text-align: center;
        color: #FFFFFF;
      }

      .register-btn {
        width: 205px;
        height: 34px;
        background: #F6876A;
        border-radius: 5px;

        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 18px;
        text-align: center;
        color: #FFFFFF;
      }
    }
  }

}
</style>