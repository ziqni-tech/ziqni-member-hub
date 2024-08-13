<template>
  <div class="single-wheel-content" :class="{'light-mode': !isDarkMode}">
    <h1 class="page-title">The Single Wheel</h1>
    <span class="page-description">Ready to test your luck? Take a spin and find out!</span>
<!--    <WheelOfFortune-->
<!--      class="wheelOfFortune"-->
<!--      :gift="gift"-->
<!--      ref="wheel"-->
<!--      v-model="data"-->
<!--      @claim="claim"-->
<!--      @closeModal="closeModal"-->
<!--      :key="rerenderKey"-->
<!--      :wheelSettings="wheelSettings.wheelSettings"-->
<!--      :messageSettings="wheelSettings.messageSettings"-->
<!--    />-->
    <div class="spinner-wrapper">
      <div ref="spinnerContainer" id="spinner-container"></div>
    </div>
    <button class="spin-btn" :disabled="isSpinButtonDisabled" @click="launchWheel">spin</button>
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
import WheelOfFortune from '@/components/awards/wheel-of-fortune/WheelOfFortune.vue';
import { useStore } from 'vuex';
import { ApiClientStomp, AwardRequest, FilesApiWs, InstantWinsApiWs } from '@ziqni-tech/member-api-client';
import { createSpinnerWheelWithAnimation, createSpinnerWheel } from 'spinning-wheel';
import WheelOfFortuneModal from '@/components/awards/wheel-of-fortune/WheelOfFortuneModal.vue';
import { useRoute } from 'vue-router';

const wheel = ref(null);
const gift = ref(5);
const isShowModal = ref(false);
const titleMessage = ref('');
const message = ref('');
const reward = ref();
const btnTitle = ref('');
const isWinner = ref(false);
const isSpinButtonDisabled = ref(false);
const selectedAward = ref(null)

// const claimedAwardsRequest = AwardRequest.constructFromObject({
//   awardFilter: {
//     statusCode: {
//       moreThan: 34,
//       lessThan: 36
//     },
//     sortBy: [{
//       queryField: 'created',
//       order: 'Desc'
//     }],
//     skip: skip.value,
//     limit: limit.value
//   },
//   currencyKey: ''
// });

// InstantWinPlayRequest
// InstantWinPlayOutcome

const rerenderKey = ref(0);
const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);
const spinnerContainer = ref(null);
const spinWheelRef = ref(null);
const resetWheelRef = ref(null);
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
  wheelSettings: { buttonText: '<p><strong class="ql-font-arial" style="color: #F4B41C;">SPIN</strong></p>',
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
  console.log('router', route.params.id);
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
          // ids: ['bt3AcpABODneUgTgQUSQ'],
          // ids: ['cWJbwo4BkKreX2mjhNEV'],
          // ids: ['ctiJ3pABfr1M4XQhSF1d'],
          status: [],
          sortBy: [],
          skip: 0,
          limit: 72,
          statusCode: []
        },
        languageKey: 'string',
        currencyKey: 'string'
      }, async (res) => {
        console.log('RES', res);
        const instantWinData = res.data[0];
        // const err = res.errors.map(err => err.message)
        // console.warn('ERR', err);

        const tiles = instantWinData.tiles;
        const settingsData = await getSettingsFile(res.data[0].id);
        data.value = instantWinData.tiles;

        if (settingsData && settingsData.wheelSettings) {
          await replaceImageIdsWithUris(settingsData.wheelSettings);
          console.log('val', wheelSettings.value);
          wheelSettings.value.wheelSettings = settingsData.wheelSettings
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

const getSettingsFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

    const fileRequest = {
      ids: [],
      limit: 20,
      skip: 0,
      parentFolderPath: "/instant-wins",
      repositoryId: '-7KLxoMBDhZrpIHgC4eP'
    };

    fileApiWsClient.getFiles(fileRequest, async (res) => {
      const settingsFile = res.data.find(item => item.name.trim() === fileName);

      if (settingsFile) {
        fetch(settingsFile.uri)
          .then((data) => {
            return data.json();
          })
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log('instant win settings file err', err);
            reject(err);
          });
      }
    });
  });
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
  const instantWin = await getInstantWin();
  await updateWheelSettings();
  await initWheel();
});

const initWheel = async () => {
  if (spinnerContainer.value) {
    // const { isCreated, spinWheel, resetWheel } = await createSpinnerWheelWithAnimation(
    const { isCreated, spinWheel, resetWheel } = await createSpinnerWheel(
      spinnerContainer.value,
      data.value,
      wheelSettings.value,
      (giftValue) => {
        const { isCompleted } = giftValue;
        console.log('isCompleted => ', isCompleted);
        if (isCompleted) {
          const reward = data.value[gift.value - 1].reward;
          done(reward);
        }
        console.log(`Wheel stopped on prize section: ${ giftValue }`);
      },
    );
    spinWheelRef.value = spinWheel;
    resetWheelRef.value = resetWheel;
  }
}

const launchWheel = () => {
  isSpinButtonDisabled.value = true;

  const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);
  // W75dDZEBOI-HgZcYNJ7z
  instantWinApiWsClient.playInstantWin( {
      awardId: 'W75dDZEBOI-HgZcYNJ7z',
      instantWinFilter: {
        constraints: [],
        ids: [route.params.id],
        instantWinTypes: [1],
        limit: 1,
        skip: 0,
        tags: []
      },
      languageKey: 'string',
      currencyKey: 'string'
  },  async (res) => {
    console.warn('InstantWinPlayOutcome =>', res);
  } )
  if (spinWheelRef.value) {
    spinWheelRef.value(gift.value); // Call the spinWheel function
  }
};

// const launchWheel = () => {
//   const randomIndex = Math.floor(Math.random() * data.value.length);
//   gift.value = randomIndex + 1;
//   setTimeout(() => {
//     wheel.value.spin();
//   }, 100);
// };

const done = async (r) => {
  console.log('wheelSettings.value', wheelSettings.value.messageSettings);
  if (r.reward && r.reward.name) {
    titleMessage.value = wheelSettings.value.messageSettings.celebrationMessage
      ? wheelSettings.value.messageSettings.celebrationMessage
      : 'Congratulations!';
    message.value = wheelSettings.value.messageSettings.celebrationText
      ? wheelSettings.value.messageSettings.celebrationText
      : `You won`;
    reward.value = { name: r.reward.name, value: r.reward.rewardValue };
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


const claim = () => {
  console.warn('CLAIM');
  // rerenderKey.value += 1;
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
    //position: absolute;
    //top: 50%;
    //left: 50%;
    //transform: translate(-50%, -50%);
  }

  #spinner-container {
    width: 100%;
    height: 100%;
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
    }
  }
}

</style>