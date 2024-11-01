<template>
  <div class="single-wheel-content" :class="{'light-mode': !isDarkMode}">
    <h1 class="page-title">The Single Wheel</h1>
    <span class="page-description">Ready to test your luck? Take a spin and find out!</span>
    <span class="page-description">Remaining Plays: {{ remainingPlays }}</span>
    <div class="spinner-wrapper">
      <div class="loader-wrapper" :class="{'hidden': isWheelCreated}">
        <img
          class="loader-wrapper__spinner"
          src="@/assets/icons/logo.svg"
          alt=""
        >
      </div>
      <div
        ref="spinnerContainer"
        id="spinner-container"
        :class="{'hidden': !isWheelCreated}"
      ></div>
    </div>
    <button
      class="spin-btn"
      :class="{'hidden': !isWheelCreated, 'disabled': isSpinButtonDisabled}"
      :disabled="isSpinButtonDisabled"
      @click="launchWheel"
    >
      spin
    </button>
    <WheelOfFortuneModal
      v-if="isShowModal"
      class="prize-modal"
      :message="message"
      :title="titleMessage"
      :btnLabel="btnTitle"
      @doFunction="isWinner ? claim() : closeModal()"
      :is-dark-mode="isDarkMode"
      :reward="reward"
    />
  </div>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { ApiClientStomp, FilesApiWs, InstantWinsApiWs } from '@ziqni-tech/member-api-client';
// import { createSpinnerWheelWithAnimation } from '@ziqni-tech/spinning-wheel';
import { createSpinnerWheel, createSpinnerWheelWithAnimation } from 'spinning-wheel';
import WheelOfFortuneModal from '@/components/awards/wheel-of-fortune/WheelOfFortuneModal.vue';
import { useRoute } from 'vue-router';

const wheel = ref(null);
const gift = ref(3);
const isShowModal = ref(false);
const titleMessage = ref('');
const message = ref('');
const reward = ref();
const btnTitle = ref('');
const isWinner = ref(false);
const isSpinButtonDisabled = ref(false);
const receivedAward = ref(null);
const remainingPlays = ref(0);

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);
const spinnerContainer = ref(null);
const spinWheelRef = ref(null);
const resetWheelRef = ref(null);
const isWheelCreated = ref(false);
const route = useRoute();

const data = ref([
  {
    section: 1,
    text: '<p class=\\"ql-align-center\\">50$ bonus 1</p>',
    background: '#8749DC',
    color: '#FFFFFF',
    icon: '',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 1.png'),
    constraints: [],
    reward: {
      name: 'BONUS',
      rewardRank: 1,
      rewardValue: 50,
      rewardTypeId: '',
    }
    // bg: require('@/assets/test/mission 1.svg')
  },
  {
    section: 2,
    text: '<p class=\\"ql-align-center\\">Free spins 2</p>',
    background: '#223241',
    color: '#FDFDFF',
    icon: '',
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 1.png'),
    constraints: ['isVerticallyText'],
    reward: {
      name: 'FREE SPINS',
      rewardRank: 1,
      rewardValue: 100,
      rewardTypeId: '',
    }
    // bg: require('@/assets/test/mission 2.svg')
  },
  {
    section: 3,
    text: '<p class=\\"ql-align-center\\">Next time 3</p>',
    background: '#40409f',
    color: '#FDFDFF',
    icon: '',
    // bg: require('@/assets/test/mission 4.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 1.png'),
    constraints: [],
    reward: {
      name: null,
      rewardRank: null,
      rewardValue: null,
      rewardTypeId: null,
    }
  },
  {
    section: 4,
    text: '<p class=\\"ql-align-center\\">50$ bonus 4</p>',
    background: '#8749DC',
    color: '#FDFDFF',
    icon: '',
    // bg: require('@/assets/test/mission 6.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/50 bonus 2.png'),
    constraints: [],
    reward: {
      name: 'BONUS',
      rewardRank: 1,
      rewardValue: 150,
      rewardTypeId: '',
    }
  },
  {
    section: 5,
    text: '<p class=\\"ql-align-center\\">Free spins 5</p>',
    background: '#223241',
    color: '#FDFDFF',
    icon: '',
    // bg: require('@/assets/test/mission 8.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/free spins 2.png'),
    constraints: [],
    reward: {
      name: 'BONUS',
      rewardRank: 1,
      rewardValue: 200,
      rewardTypeId: '',
    }
  },
  {
    section: 6,
    text: '<p class=\\"ql-align-center\\">50$ bonus 6</p>',
    background: '#40409f',
    color: '#FDFDFF',
    icon: '',
    // bg: require('@/assets/test/mission 7.svg')
    bg: require('@/assets/images/instant-wins/single-wheel_bgs/next time 2.png'),
    constraints: [],
    reward: {
      name: null,
      rewardRank: null,
      rewardValue: null,
      rewardTypeId: null,
    }
  },
  {
    section: 7,
    text: '<p class=\\"ql-align-center\\">Next time 7</p>',
    background: '#8749DC',
    color: '#FDFDFF',
    icon: '',
    bg: require('@/assets/test/mission 8.svg'),
    constraints: ['isVerticallyText'],
    reward: {
      name: 'Free spins',
      rewardRank: 1,
      rewardValue: 300,
      rewardTypeId: '',
    }
  },
  {
    section: 8,
    text: '<p class=\\"ql-align-center\\">50$ bonus 8</p>',
    background: '#223241',
    color: '#FDFDFF',
    icon: '',
    bg: require('@/assets/test/mission 7.svg'),
    constraints: ['isVerticallyText'],
    reward: {
      name: null,
      rewardRank: null,
      rewardValue: null,
      rewardTypeId: null,
    }
  },
]);

const wheelSettings = ref({
  wheelSettings: {
    buttonText: '<p><strong class="ql-font-arial" style="color: #F4B41C;">SPIN</strong></p>',
    wheelBackground: '#5E084B',
    spinButtonBackground: '#5E084B',
    icon: '',
    wheelBorderImage: '',
    wheelImage: '',
    wheelButtonImage: '',
    wheelArrowImage: ''
  },
  messageSettings: {
    // celebrationMessage: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Congratulations!</em></p>',
    celebrationMessage: '<p><em >Congratulations!</em></p>',
    // celebrationText: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">You won</em></p>',
    celebrationText: '<p><em >You won</em></p>',
    celebrationImage: '',
    shapeOfCelebrationMessageBox: '',
    isCelebrationAnimation: true,
    // sorryMessage: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Didn\'t win this time!</em></p>',
    sorryMessage: '<p><em >Didn\'t win this time!</em></p>',
    // sorryText: '<p><em style="background-color: rgb(243, 243, 243); color: rgb(0, 0, 0);">Wishing you better luck in the future</em></p>',
    sorryText: '<p><em >Wishing you better luck in the future</em></p>',
    sorryImage: '',
    shapeOfSorryMessageBox: '',
    isSorryAnimation: false
  }
});

const getInstantWin = () => {
  return new Promise((resolve, reject) => {
    try {
      const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);

      instantWinApiWsClient.listInstantWins({
        instantWinFilter: {
          productIds: [],
          tags: [],
          startDate: {},
          endDate: {},
          ids: [route.params.id],
          status: [],
          sortBy: [],
          skip: 0,
          limit: 72,
          statusCode: []
        },
        languageKey: '',
        currencyKey: ''
      }, async (res) => {
        const instantWinData = res.data[0];

        const tiles = instantWinData.tiles;
        const settingsData = await getSettingsFile(res.data[0]);
        data.value = instantWinData.tiles;

        if (settingsData && settingsData.wheelSettings) {
          await replaceImageIdsWithUris(settingsData.wheelSettings);
          wheelSettings.value.wheelSettings = settingsData.wheelSettings;
        }

        if (settingsData && settingsData.messageSettings) {
          await replaceImageIdsWithUris(settingsData.messageSettings);
        }

        const instantWin = { tiles, settingsData };
        resolve(instantWin);
      });
    } catch (err) {
      console.log('getInstantWin error => ', err);
      reject(err);
    }
  });
};

const getAvailablePlays = () => {
  const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);
  const getAvailablePlaysPayload = {
    instantWinIds: [route.params.id]
  };
  console.log('getAvailablePlaysPayload', getAvailablePlaysPayload);
  instantWinApiWsClient.getInstantWinAvailablePlays(getAvailablePlaysPayload, async (res) => {
    console.warn('getInstantWinAvailablePlays', res);
    if (!res.errors) {
      remainingPlays.value = res.data[0].remainingPlays;
      remainingPlays.value > 0 ? isSpinButtonDisabled.value = false : isSpinButtonDisabled.value = true;
    }

  });
};

const getSettingsFile = async (file) => {
  try {
    if (!file.instanceResourceLink) {
      console.log('File or resource link not provided');
      return null;
    }

    const data = await fetch(file.instanceResourceLink);

    return await data.json();

  } catch (error) {
    console.error(`Error fetching settings file for ${ file }:`, error);
    return null;
  }
};

const getFileUri = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data[0].uri);
    });
  });
};

const replaceImageIdsWithUris = async (obj) => {
  const keys = Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];

    if (typeof value === 'string' && value.match(/^[-\w]+$/)) {
      // Assume this is an ID and fetch the URI
      obj[key] = await getFileUri(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      await replaceImageIdsWithUris(value);
    }
  }
};

const updateWheelSettings = async () => {
  await replaceImageIdsWithUris(wheelSettings.value);
};

onMounted(async () => {
  await getInstantWin();
  await getAvailablePlays();
  await updateWheelSettings();
  await initWheel();
});

const initWheel = async () => {
  if (spinnerContainer.value) {
    const { isCreated, spinWheel, resetWheel } = await createSpinnerWheelWithAnimation(
      // const { isCreated, spinWheel, resetWheel } = await createSpinnerWheel(
      spinnerContainer.value,
      data.value,
      wheelSettings.value,
      (giftValue) => {
        const { isCompleted } = giftValue;

        if (isCompleted) {
          done(receivedAward.value);

        }
      },
      false,
      false,
      {
        showGlow: false,
        glowColor: '#FF5733'
      },
      {width: 30, height: 25, position: 'bottom'}
    );

    setTimeout(() => {
      isWheelCreated.value = isCreated;
    }, 500);

    spinWheelRef.value = spinWheel;
    resetWheelRef.value = resetWheel;
  }
};

const launchWheel = async () => {
  isSpinButtonDisabled.value = true;
  const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);

  const playInstantWinPayload = {
    instantWinId: route.params.id,
    languageKey: '',
    currencyKey: ''
  };

  const requestStartTime = Date.now();
  await instantWinApiWsClient.playInstantWin(playInstantWinPayload, (res) => {
    const responseTime = Date.now();

    if (res.data.length && res.data[0].results && res.data[0].results.tiles.length) {
      const playData = res.data[0];
      remainingPlays.value = playData.remainingPlays;

      const playDataResults = playData.results;
      const winSection = playDataResults.tiles[0].location?.col ?? null;

      receivedAward.value = playDataResults.awards ? playDataResults.tiles[0].reward : null;
      if (spinWheelRef.value && winSection) {
        spinWheelRef.value(winSection); // Call the spinWheel function
      }

    }

    const responseDuration = responseTime - requestStartTime;
    const responseDurationInSeconds = responseDuration / 1000;

    console.log(`Reply received via: ${ responseDuration } ms`);
    console.log(`Reply received via: (${ responseDurationInSeconds.toFixed(2) } sec)`);


  });
};

const done = async (award) => {

  if (award && award.name) {
    titleMessage.value = wheelSettings.value.messageSettings.celebrationMessage
      ? wheelSettings.value.messageSettings.celebrationMessage
      : 'Congratulations!';
    message.value = wheelSettings.value.messageSettings.celebrationText
      ? wheelSettings.value.messageSettings.celebrationText
      : `You won`;
    reward.value = { name: award.name, value: award.rewardValue };
    btnTitle.value = 'Claim';
    isWinner.value = true;
  } else {
    titleMessage.value = wheelSettings.value.messageSettings.sorryMessage
      ? wheelSettings.value.messageSettings.sorryMessage
      : 'Didn\'t win this time!';
    message.value = wheelSettings.value.messageSettings.sorryText
      ? wheelSettings.value.messageSettings.sorryText
      : `Wishing you better luck in the future`;
    btnTitle.value = 'Return';
    isWinner.value = false;
  }

  isShowModal.value = true;
};


const claim = async () => {
  isShowModal.value = false;
  resetWheelRef.value();
  isSpinButtonDisabled.value = false;
};

const closeModal = () => {
  // rerenderKey.value += 1;
  isShowModal.value = false;
  resetWheelRef.value();
  isSpinButtonDisabled.value = false;
};

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables';

.hidden {
  visibility: hidden;
}

.single-wheel-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

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

  .spinner-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;

    @media screen and (max-width: 450px) {
      top: 40%;
    }

    &__spinner {
      width: 47px;
      height: 45px;
      opacity: 0.7;
      animation: rotation 2.5s linear infinite normal;
      z-index: 10;

      @keyframes rotation {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(359deg);
        }
      }
    }

  }

  #spinner-container {
    width: 80%;
    height: 80%;
  }

  .spin-btn {
    display: flex;
    max-width: 150px;
    margin-top: 20px;
    padding: 10px 57px;
    margin-bottom: 50px;

    font-family: $bold;
    font-size: 14px;
    text-transform: capitalize;
    color: $btn-primary-color-LM;

    border: none;
    border-radius: $border-radius;
    cursor: pointer;
    background-color: $btn-primary-bg-color-LM;

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
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
      margin-bottom: 20px;
      padding: 10px 57px;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;

      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}

</style>
