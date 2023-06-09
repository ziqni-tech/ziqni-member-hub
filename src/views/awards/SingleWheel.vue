<template>
  <h1 class="page-title">The Single Wheel</h1>
  <span class="page-description">Ready to test your luck? Take a spin and find out!</span>
  <WheelOfFortune
      :gift="gift"
      ref="wheel"
      v-model="data"
      @done="done"
  />
  <button class="spin-btn" @click="launchWheel">spin</button>
  <AwardsModal
      :modalShow="isShowModal"
      :message="message"
      :title="titleMessage"
      :btnLabel="btnTitle"
      @doFunction="isWinner ? claim() : closeModal()"
      v-on:toggle-modal="isShowModal = false"
  />
</template>

<script setup>
import { ref } from 'vue';
import WheelOfFortune from '@/components/awards/WheelOfFortune.vue';
import AwardsModal from '@/components/awards/AwardsModal.vue';

const wheel = ref(null);
const gift = ref(0);

const titleMessage = ref('');
const message = ref('');
const btnTitle = ref('');
const isWinner = ref(false);

const data = ref([
  {
    id: 1,
    value: '50$ bonus',
    bgColor: '#8749DC',
    color: '#FFFFFF',
    image: require('@/assets/images/instant-wins/reward50_1.png')
  },
  {
    id: 2,
    value: 'Free spins',
    bgColor: '#223241',
    color: '#FDFDFF',
    image: require('@/assets/images/instant-wins/free_spin_1.png')
  },
  {
    id: 3,
    value: 'Next time',
    bgColor: '#40409f',
    color: '#FDFDFF',
    image: require('@/assets/images/instant-wins/next_time_1.png')
  },
  {
    id: 4,
    value: '50$ bonus',
    bgColor: '#8749DC',
    color: '#FDFDFF',
    image: require('@/assets/images/instant-wins/reward50_2.png')
  },
  {
    id: 5,
    value: 'Free spins',
    bgColor: '#223241',
    color: '#FDFDFF',
    image: require('@/assets/images/instant-wins/free_spin_2.png')
  },
  {
    id: 6,
    value: 'Next time',
    bgColor: '#40409f',
    color: '#FDFDFF',
    image: require('@/assets/images/instant-wins/next_time_2.png')
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
const done = (r) => {
  if (r.value !== 'Next time') {
    titleMessage.value = 'Congratulations!';
    message.value = `You won ${ r.value }`;
    btnTitle.value = 'Claim';
    isWinner.value = true;
  } else {
    titleMessage.value = 'Didn\'t win this time!';
    message.value = `Wishing you better luck in the future`;
    btnTitle.value = 'Return';
    isWinner.value = false;
  }

  isShowModal.value = true;
};

const claim = () => {
  console.warn('CLAIM');
  isShowModal.value = false;
};

const closeModal = () => {
  console.warn('RETURN');
  isShowModal.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.page-title {
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: $main-text-color-white;
  margin-top: 50px;
}

.page-description {
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: $body-text-color;
}

.spin-btn {
  margin-top: 20px;
  padding: 10px 57px;

  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  color: $main-text-color-white;

  border: none;
  border-radius: $border-radius;
  cursor: pointer;
  background-color: $purple;
}

@media screen and (max-width: $tableWidth) {
  .page-title {
    font-weight: 700;
    font-size: 16px;
    line-height: 19px;
    color: $main-text-color-white;
    margin-top: 30px;
  }

  .page-description {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: $body-text-color;
  }

  .spin-btn {
    margin-top: 10px;
    padding: 10px 57px;

    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $main-text-color-white;

    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    background-color: $purple;
  }
}

</style>