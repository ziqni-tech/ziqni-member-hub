<template>
  <div class="single-wheel-content" :class="{'light-mode': !isDarkMode}">
    <h1 class="page-title">The Single Wheel</h1>
    <span class="page-description">Ready to test your luck? Take a spin and find out!</span>
    <WheelOfFortune
        class="wheelOfFortune"
        :gift="gift"
        ref="wheel"
        v-model="data"
        @claim="claim"
        @closeModal="closeModal"
        :key="rerenderKey"
    />
    <button class="spin-btn" @click="launchWheel">spin</button>
  </div>

</template>

<script setup>
import { computed, ref } from 'vue';
import WheelOfFortune from '@/components/awards/WheelOfFortune.vue';
import { useStore } from 'vuex';

const wheel = ref(null);
const gift = ref(0);

const message = ref('');
const rerenderKey = ref(0);
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const data = ref([
  {
    id: 1,
    section: 1,
    value: '50$ bonus 1',
    bgColor: '#8749DC',
    color: '#FFFFFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 1.png')
    // bg: require('@/assets/test/mission 1.svg')
  },
  {
    id: 2,
    section: 2,
    value: 'Free spins 1',
    bgColor: '#223241',
    color: '#FDFDFF',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 1.png')
    // bg: require('@/assets/test/mission 2.svg')
  },
  {
    id: 3,
    section: 3,
    value: 'Next time 1',
    bgColor: '#40409f',
    color: '#FDFDFF',
    // bg: require('@/assets/test/mission 4.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 1.png')
  },
  {
    id: 4,
    section: 4,
    value: '50$ bonus 2',
    bgColor: '#8749DC',
    color: '#FDFDFF',
    // bg: require('@/assets/test/mission 6.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 2.png')
  },
  {
    id: 5,
    section: 5,
    value: 'Free spins 2',
    bgColor: '#223241',
    color: '#FDFDFF',
    // bg: require('@/assets/test/mission 8.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 2.png')
  },
  {
    id: 6,
    section: 6,
    value: 'Next time 2',
    bgColor: '#40409f',
    color: '#FDFDFF',
    // bg: require('@/assets/test/mission 7.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  },
  // {
  //   id: 7,
  //   section: 7,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/test/mission 8.svg')
  // },
  // {
  //   id: 8,
  //   section: 8,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/test/mission 7.svg')
  // },
  // {
  //   id: 9,
  //   section: 9,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/test/mission 4.svg')
  // },
  // {
  //   id: 9,
  //   section: 9,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  // },
  // {
  //   id: 10,
  //   section: 10,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  // },
  // {
  //   id: 11,
  //   section: 10,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  // },
  // {
  //   id: 12,
  //   section: 10,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  // },
  // {
  //   id: 13,
  //   section: 10,
  //   value: 'Next time 2',
  //   bgColor: '#40409f',
  //   color: '#FDFDFF',
  //   bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png')
  // },
]);

const isShowModal = ref(false);

const launchWheel = () => {
  const randomIndex = Math.floor(Math.random() * data.value.length);
  gift.value = randomIndex + 1;
  setTimeout(() => {
    wheel.value.spin();
  }, 100);
};


const claim = () => {
  console.warn('CLAIM');
  rerenderKey.value += 1;
  isShowModal.value = false;
};

const closeModal = () => {
  rerenderKey.value += 1;
  isShowModal.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.single-wheel-content {

  .page-title {
    font-family: $bold;
    font-size: 24px;
    color: $text-color-white;
    margin-top: 50px;
  }

  .page-description {
    font-family: $mainFont;
    font-size: 14px;
    color: $description-color-DM;
  }

  .wheelOfFortune {
    margin-top: 50px;
  }

  .spin-btn {
    margin-top: 20px;
    padding: 10px 57px;

    font-family: $bold;
    font-size: 14px;
    text-transform: capitalize;
    color: $btn-primary-color-LM;

    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    background-color: $btn-primary-bg-color-LM;
  }

  &.light-mode {
    .page-title {
      font-family: $bold;
      font-size: 24px;
      color: $section-title-color-LM;
    }

    .page-description {
      font-family: $mainFont;
      font-size: 14px;
      color: $card-title-color-LM;
    }
  }
}

@media screen and (max-width: 420px) {
  .single-wheel-content {
    .page-title {
      font-size: 16px;
      color: $text-color-white;
      margin-top: 30px;
    }

    .page-description {
      font-size: 12px;
      color: $description-color-DM;
    }

    .wheelOfFortune {
      margin-top: 0;
    }

    .spin-btn {
      margin-top: 10px;
      padding: 10px 57px;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
    }
  }
}

</style>