<template>
  <div class="loyality-charts-card">
    <div class="user-data">
      <span class="user-data__name">Killan James</span>
      <span class="user-data__earnings">$16,605</span>
      <span class="user-data__market_avarage">market avarage is $16,224</span>
      <span class="user-data__btn"><img :src="buttonArrowIcon" alt=""></span>
    </div>
    <SemiCircleGaugeChart />
    <MultipleRadialbarsChart />
    <ModelSpend
      v-if="!isMobile"
      :icon="carIcon"
      :price="'1,174'"
      :title="'Model Spend'"
    />
    <ModelSpend
      v-if="!isMobile"
      :icon="arrowIcon"
      :price="'1,174'"
      :title="'Model Spend'"
    />
    <ModelSpend
      v-if="!isMobile"
      :icon="dollarIcon"
      :price="'811'"
      :title="'Spend per Unit Turned'"
    />
  </div>
</template>

<script setup>
import MultipleRadialbarsChart from './MultipleRadialbarsChart';
import SemiCircleGaugeChart from './SemiCircleGaugeChart';
import carIcon from '../../assets/icons/loyality-level/chart-card-car-icon.png';
import arrowIcon from '../../assets/icons/loyality-level/chart-card-arrow-icon.png';
import dollarIcon from '../../assets/icons/loyality-level/chart-card-dollar-icon.png';
import buttonArrowIcon from '../../assets/icons/loyality-level/chart-card-button-arrow-icon.png';
import ModelSpend from './ModelSpend';
import { useMedia } from '../../hooks/useMedia';

const isMobile = useMedia('(max-width: 480px)');
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';
.loyality-charts-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23px 29px;
  max-width: 1041px;
  background: #FFFFFF;
  box-shadow: 0 7px 21px rgba(180, 180, 180, 0.25);
  border-radius: 10px;

  @media screen and (max-width: $phoneWidth) {
    padding: 14px 18px;

    .user-data {

      &__name {
        max-width: 100px;
        font-weight: 500;
      }

      &__market_avarage {
        max-width: 100px;
      }
    }
  }

  .user-data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__name {
      //font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      color: #242731;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &__earnings {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 23px;
      color: #FF6464;
      padding-top: 5px;
    }

    &__market_avarage {
      font-family: 'Poppins', sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: #72767C;
      padding: 5px 0 8px;
      //white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: start;
    }

    &__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 14px;
      width: 48px;
      height: 20px;
      background: #FF6370;
      box-shadow: 0 1px 2px rgba(252, 189, 189, 0.25);
      border-radius: 10px;

      & > img {
        width: 12px;
        height: 8px;
      }
    }
  }
}
</style>