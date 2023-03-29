<template>
  <CCard class="monthly-tournament-card">
    <CCardBody class="monthly-tournament-card-body">
      <div class="content-wrapper">
        <div class="card-content">
          <img :src="dragonTitleImg" alt="">
          <div>
            <div class="prize">{{ price }}</div>
            <span class="tournament-title">Monthly Tournament</span>
          </div>
          <Countdown
            :date="end"
            :title="'ends in'"
            :is-column="true"
            :is-big-size="true"
            @onFinish="finish()"
          />
          <CButton class="m-btn">Register</CButton>
        </div>
        <CCardImage class="card-image" :src="dragonImg" />
      </div>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { CCard, CCardBody, CCardImage, CButton } from '@coreui/vue'
import dragonImg from '../assets/images/floating-dragon.png';
import dragonTitleImg from '../assets/images/floating-dragon-title.svg';
import Countdown from './Countdown';

const end = new Date('2023-01-01T00:00:00');

let euro = Intl.NumberFormat('en-DE', {
  style: 'currency',
  currency: 'EUR',
});

const price = `${euro.format(9000)}`;

const finish = () => {
  console.log('finish');
}
</script>

<style lang="scss">
@import '../assets/scss/utils/vars';

.monthly-tournament-card {
  //width: 360px;
  //height: 454px;
  border-radius: 14px;
  overflow: hidden;

  @media screen and (max-width: $phoneWidth){
    .monthly-tournament-card {
      width: 100%;
    }
  }

  .monthly-tournament-card-body {
    padding: 0;
  }

  .content-wrapper {
    width: 100%;
    height: 100%;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(180deg, $card-deep-blue-bg-color 7.27%, $card-deep-blue-bg-color 36.25%, rgba(69, 64, 123, 0) 100%);
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
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 16px 10px 41px;
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      color: $mainWhiteFontColor;

      .prize {
        font-weight: 700;
        font-size: 39px;
        line-height: 52px;
        text-align: center;
      }

      .tournament-title {
        font-weight: 500;
        font-size: 19px;
        line-height: 26px;
        text-align: center;
      }
    }
  }

}
</style>