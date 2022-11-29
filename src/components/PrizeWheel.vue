<template>
  <div class="prize-wheel" :style="{'background-image': `url(${cardBgImg})`}">
    <div class="prize-wheel__wheel" :style="{'background-image': `url(${wheelBgImg})`}"></div>
    <div class="prize-wheel__data">
      <div class="prize-wheel__data__coins-data">
        <img :src="$options.coinsCrownIcon" alt="">
        <span class="text">{{ coinsValue }} Coins</span>
      </div>
      <div class="prize-wheel__data__title">{{ type }} Prize Wheel</div>
    </div>
    <div class="prize-wheel__frame" :style="{'--color': `${frameBgColor}`}"></div>
  </div>
</template>

<script>
import blueBg from '../assets/images/prize-wheel/blue_coins_bg.png';
import purpleBg from '../assets/images/prize-wheel/purple_coins_bg.png';
import orangeBg from '../assets/images/prize-wheel/orange_coins_bg.png';

import orangeWheelBg from '../assets/images/prize-wheel/orange_coins_wheel.png';
import blueWheelBg from '../assets/images/prize-wheel/blue_coins_wheel.png';
import purpleWheelBg from '../assets/images/prize-wheel/purple_coins_wheel.png';

import coinsCrownIcon from '../assets/icons/coins-wheel_crown_icon.png';

export default {
  name: 'PrizeWheel',
  coinsCrownIcon,
  props: {
    type: { type: String, default: 'blue' }
  },
  data() {
    return {
      cardBgImg: '',
      wheelBgImg: '',
      frameBgColor: '',
      coinsValue: null
    }
  },
  created() {
    this.setBg();
  },
  methods: {
    setBg() {
      switch (this.type.toLowerCase()) {
        case 'rare': {
          this.cardBgImg = blueBg;
          this.wheelBgImg = blueWheelBg;
          this.frameBgColor = '#2A9EFF';
          this.coinsValue = 1500;
          break;
        }
        case 'epic': {
          this.cardBgImg = purpleBg;
          this.wheelBgImg = purpleWheelBg;
          this.frameBgColor = '#A97CFF';
          this.coinsValue = 3000;
          break;
        }
        case 'legendary': {
          this.cardBgImg = orangeBg;
          this.wheelBgImg = orangeWheelBg;
          this.frameBgColor = '#FF8048';
          this.coinsValue = 6000;
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.prize-wheel {
  position: relative;
  width: 246px;
  height: 246px;
  border-radius: 5px;

  &__wheel {
    position: absolute;
    width: 200px;
    height: 200px;
    top: -15%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }

  &__frame {
    position: absolute;
    bottom: -14px;
    left: 26px;
    width: 122px;
    height: 28px;

    background: var(--color);
    border: 2px solid var(--color);
    border-radius: 14px;
  }

  &__data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    top: 173px;
    left: 35px;

    &__coins-data {
      display: flex;
      align-items: center;

      > .text {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-size: 21px;
        line-height: 32px;
        letter-spacing: 0.22px;
        color: #FFFFFF;
        margin-left: 6px;
      }
    }
    &__title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

}
</style>