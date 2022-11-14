<template>
  <CCard class="IRC-card">
    <CCardBody class="IRC-card-body">
      <div class="content-wrapper">
        <CCardImage class="card-image" :src="$options.kittyImg" />
        <div class="card-content">
          <div class="content-block">
            <span class="card-title">Instant Rewards Chances</span>
            <CButton class="see-more-btn">See more</CButton>
          </div>
        </div>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody, CCardImage, CButton  } from '@coreui/vue';
import kittyImg from '../assets/images/kitty.png';

export default {
  name: 'InstantRewardsChancesCard',
  kittyImg,
  components: {
    CCard,
    CCardBody,
    CCardImage,
    CButton
  }
};
</script>

<style lang="scss">
.IRC-card {
  width: 611px;
  height: 204px;
  filter: drop-shadow(0px 7px 21px rgba(180, 180, 180, 0.25));
  overflow: hidden;

  .IRC-card-body {
    padding: 0;

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
        background: linear-gradient(96.62deg, #5750A4 26.11%, rgba(87, 80, 164, 0) 77.13%);
      }

      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .card-content {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        padding: 36px 34px 41px;
        display: flex;
        justify-content: start;

        .content-block {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;

          .card-title {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 700;
            font-size: 18px;
            line-height: 27px;
            color: #FFFFFF;
          }

          .see-more-btn {
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
  }


}
</style>