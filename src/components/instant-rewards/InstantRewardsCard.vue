<template>
  <div class="instant-rewards-card">
    <div class="instant-rewards-card__data">
      <span class="instant-rewards-card__data__title">Rewards</span>
      <ScratchCardItem
        :icon="$options.millIcon"
        :title="'Wheel of fortune'"
        :price="'67'"
        :date="'15-Dec-2022'"
      />
      <ScratchCardItem
          :icon="$options.diamondIcon"
          :title="'Casino'"
          :price="'67'"
          :date="'15-Dec-2022'"
      />
    </div>
    <div class="money-box-img-wrapper">
      <img :src="$options.moneyBoxImg" alt="" class="money-box-img">
    </div>
  </div>
</template>

<script>
import moneyBoxImg from '../../assets/images/money-box.png';
import millIcon from '../../assets/icons/mill.svg';
import diamondIcon from '../../assets/icons/diamond.svg';
import ScratchCardItem from './ScratchCardItem';
export default {
  name: 'InstantRewardsCard',
  components: { ScratchCardItem },
  moneyBoxImg,
  millIcon,
  diamondIcon,
  data() {
    return {

    }
  }
};
</script>

<style lang="scss">
.instant-rewards-card {
  position: relative;
  width: 665px;
  height: 325px;
  display: flex;
  justify-content:start;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  &:before {
    content: '';
    position: absolute;
    top: -30px;
    left: 56%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #D9D9D9;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -30px;
    left: 56%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #D9D9D9;
  }

  &__data {
    width: 60%;
    padding: 24px 26px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &__title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 27px;

      color: #3E548D;
      padding-bottom: 45px;
    }
  }

  .money-box-img-wrapper{
    width: 39%;
    height: 100%;
    border-left: 2px dashed #F4F2F5;

    .money-box-img {
      padding-top: 70px;
    }
  }
}
</style>