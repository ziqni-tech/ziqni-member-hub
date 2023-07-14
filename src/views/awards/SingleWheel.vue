<template>
  <h1 class="page-title">The Single Wheel</h1>
  <span class="page-description">Ready to test your luck? Take a spin and find out!</span>
  <WheelOfFortune
      :gift="gift"
      ref="wheel"
      v-model="data"
      @claim="claim"
      @closeModal="closeModal"
      :key="rerenderKey"
  />
  <button class="spin-btn" @click="launchWheel">spin</button>
</template>

<script setup>
import { ref } from 'vue';
import WheelOfFortune from '@/components/awards/WheelOfFortune.vue';

const wheel = ref(null);
const gift = ref(0);

const message = ref('');
const rerenderKey = ref(0);

const data = ref([
  {
    id: 1,
    section: 1,
    value: '50$ bonus 1',
    bgColor: '#8749DC',
    color: '#FFFFFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 1.png')
  },
  {
    id: 2,
    section: 2,
    value: 'Free spins 1',
    bgColor: '#223241',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 1.png')
  },
  {
    id: 3,
    section: 3,
    value: 'Next time 1',
    bgColor: '#40409f',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 1.png')
  },
  {
    id: 4,
    section: 4,
    value: '50$ bonus 2',
    bgColor: '#8749DC',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 2.png')
  },
  {
    id: 5,
    section: 5,
    value: 'Free spins 2',
    bgColor: '#223241',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 2.png')
  },
  {
    id: 6,
    section: 6,
    value: 'Next time 2',
    bgColor: '#40409f',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  },
]);

const isShowModal = ref(false);

const launchWheel = () => {
  const randomIndex = Math.floor(Math.random() * data.value.length);
  gift.value = randomIndex + 1;
  setTimeout(() => {
    wheel.value.spin();
  }, 100);
};
// const done = (r) => {
//   console.warn('done ', r);
//   if (r.value !== 'Next time') {
//     titleMessage.value = 'Congratulations!';
//     message.value = `You won ${ r.value }`;
//     btnTitle.value = 'Claim';
//     isWinner.value = true;
//   } else {
//     titleMessage.value = 'Didn\'t win this time!';
//     message.value = `Wishing you better luck in the future`;
//     btnTitle.value = 'Return';
//     isWinner.value = false;
//   }
//
//   isShowModal.value = true;
// };

const claim = () => {
  console.warn('CLAIM');
  rerenderKey.value += 1;
  isShowModal.value = false;
};

const closeModal = () => {
  console.warn('RETURN');
  rerenderKey.value += 1;
  isShowModal.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.page-title {
  font-family: $mainFont;
  font-size: 24px;
  color: $text-color-white;
  margin-top: 50px;
}

.page-description {
  font-family: $semi-bold;
  font-size: 16px;
  color: $body-text-color;
}

.spin-btn {
  margin-top: 20px;
  padding: 10px 57px;

  font-family: $semi-bold;
  font-size: 16px;
  color: $text-color-white;

  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  background-color: $purple;
}

@media screen and (max-width: $tableWidth) {
  .page-title {
    font-size: 22px;
    color: $text-color-white;
    margin-top: 30px;
  }

  .page-description {
    font-size: 12px;
    color: $body-text-color;
  }

  .spin-btn {
    margin-top: 10px;
    padding: 10px 57px;

    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $text-color-white;

    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    background-color: $purple;
  }
}

@media screen and (max-width: 380px) {
  .page-title {
    font-size: 20px;
    color: $text-color-white;
    margin-top: 10px;
  }

  .page-description {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: $body-text-color;
  }

  .spin-btn {
    margin-top: 0;
    padding: 10px 57px;

    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $text-color-white;

    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    background-color: $purple;
  }
}

</style>