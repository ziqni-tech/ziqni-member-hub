<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header">
      <h2 class="section-title" v-if="isDashboard">Instant wins</h2>
      <router-link :to="{ path: '/awards', query: { tab: 'instantWins' } }">
        <div v-if="isDashboard" class="see-all-btn">
          see all
        </div>
      </router-link>
    </div>
    <div class="content-wrapper">
      <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
        <div v-for="wheel in wheels" :key="wheel.id" class="instant-wins-card" :class="{'light-mode': !isDarkMode}">
          <h3 class="mobile-card-title">{{ wheel.name }}</h3>
          <div class="instant-img-wrapper">
            <div
              :ref="setSpinnerContainerRef(wheel.id)"
              class="spinner-container"
            ></div>
          </div>
          <div class="instant-info">
            <h3 class="card-title">{{ wheel.name }}</h3>
            <div class="card-description" v-html="wheel.description"></div>
            <button class="play-btn" @click.stop="goToSingleWheel(wheel.id)">Play</button>
          </div>
        </div>
        <div>
          <InstantWinsCard
            :img="scratchcardImg"
            :title="scratchcardsTitle"
            :description="description"
            @play="scratchcardsPlay"
            :isDarkMode="isDarkMode"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import InstantWinsCard from './InstantWinsCard';
import singleWheelImg from '@/assets/images/instant-wins/single-wheel.png';
import singleWheelImgLight from '@/assets/images/instant-wins/single-wheel_light.png';
import scratchcardsImg from '@/assets/images/instant-wins/scratchcard.png';
import scratchcardsImgLight from '@/assets/images/instant-wins/scratchcard_light.png';
import { useRouter } from 'vue-router';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { ApiClientStomp, FilesApiWs, InstantWinsApiWs } from '@ziqni-tech/member-api-client';
import { createSpinnerWheel } from 'spinning-wheel';

const singleWheelTitle = 'The Single Wheel';
const scratchcardsTitle = 'Scratchcards';
const description = 'Short description about this instant wins';

const wheelImg = computed(() => (isDarkMode.value ? singleWheelImg : singleWheelImgLight));
const scratchcardImg = computed(() => (isDarkMode.value ? scratchcardsImg : scratchcardsImgLight));
const wheels = ref([]);
const spinnerContainers = ref({});

const setSpinnerContainerRef = (id) => (el) => {
  if (el) {
    spinnerContainers.value[id] = el;
  }
};

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);

const router = useRouter();

const singleWheelPlay = () => {
  router.push({
    name: 'SingleWheelsList',
  });
};

const scratchcardsPlay = () => {
  router.push({
    name: 'Scratchcards',
  });
};

const goToSingleWheel = (id) => {
  router.push({
    name: 'SingleWheel',
    params: {
      id: id,
    },
  });
};

onMounted(async () => {
  let instantWins = await getInstantWin();
  if (props.isDashboard) {
    instantWins = instantWins.slice(0, 1);
  }

  for (const instantWin of instantWins) {
    const { id, tiles, settingsData } = instantWin;
    wheels.value.push(instantWin);

    await nextTick(); // Ensure the DOM is updated before accessing the ref

    const spinnerContainer = spinnerContainers.value[id];

    if (spinnerContainer) {
      const { isCreated, spinWheel, resetWheel } = await createSpinnerWheel(
        spinnerContainer,
        tiles,
        settingsData,
        (giftValue) => {
          // Handle the result of the spin
        },
        true
      );
    }
  }
});

const getInstantWin = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);
      instantWinApiWsClient.listInstantWins(
        {
          instantWinFilter: {
            productIds: [],
            tags: [],
            startDate: {},
            endDate: {},
            ids: [],
            status: [],
            sortBy: [],
            skip: 0,
            limit: 72,
            statusCode: [],
          },
          languageKey: 'string',
          currencyKey: 'string',
        },
        async (res) => {
          const instantWinsData = res.data;
          const wheels = instantWinsData.filter((item) => item.instantWinType === 1);

          const instantWinsWithSettings = await Promise.all(
            wheels.map(async (wheel) => {
              const settingsData = await getSettingsFile(wheel.id);
              const tiles = wheel.tiles;

              if (settingsData && settingsData.wheelSettings) {
                await replaceImageIdsWithUris(settingsData.wheelSettings);
              }

              if (settingsData && settingsData.messageSettings) {
                await replaceImageIdsWithUris(settingsData.messageSettings);
              }

              return {
                id: wheel.id,
                name: wheel.name,
                description: wheel.description,
                tiles,
                settingsData,
              };
            })
          );

          resolve(instantWinsWithSettings);
        }
      );
    } catch (err) {
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
      parentFolderPath: '/instant-wins',
      repositoryId: '-7KLxoMBDhZrpIHgC4eP',
    };

    fileApiWsClient.getFiles(fileRequest, async (res) => {
      const settingsFile = res.data.find((item) => item.name.trim() === fileName);

      if (settingsFile) {
        fetch(settingsFile.uri)
          .then((data) => data.json())
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};

const replaceImageIdsWithUris = async (obj) => {
  const keys = Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];

    if (typeof value === 'string' && value.match(/^[-\w]+$/)) {
      obj[key] = await getFileUri(value);
    } else if (typeof value === 'object' && value !== null) {
      await replaceImageIdsWithUris(value);
    }
  }
};

const getFileUri = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0,
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data && res.data[0] ? res.data[0].uri : null);
    });
  });
};
</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.section {
  .instant-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 15px;
  }

  &.light-mode {
    .section-header {
      .section-title {
        color: $section-title-color-LM;
      }
    }
  }
}

.spinner-container {
  width: 100%;
  height: 100%;
}

.instant-wins-card {
  display: flex;
  padding: 10px;
  border-radius: $border-radius;
  background-color: $card-bg-DM;

  width: 100%;
  height: auto;
  aspect-ratio: 3 / 1;
  font-family: $semi-bold;

  .mobile-card-title {
    display: none;
  }

  .instant-img-wrapper {
    width: 44%;
    height: 100%;
    background-color: $prize-btn-bg-DM;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;

    .instant-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .instant-info {
    display: flex;
    flex-direction: column;
    width: 56%;
    height: 100%;
    padding: 6px 16px 0;

    .card-title {
      font-size: 14px;
      font-family: $bold;
      color: $white-color-DM;
      text-align: start;
    }

    .card-description {
      font-size: 12px;
      color: $description-color-DM;
      font-family: $mainFont;
      text-align: start;
      margin-top: 5px;
      max-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .play-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $btn-primary-bg-color-LM;
      border-radius: $border-radius;
      border: 1px solid $btn-border-color-LM;

      font-size: 14px;
      font-family: $bold;
      color: $text-color-white;

      margin-top: auto;
      max-width: 124px;
    }
  }

  &.light-mode {
    background-color: $card-bg-LM;

    .mobile-card-title {
      display: none;
    }

    .instant-img-wrapper {
      width: 44%;
      height: 100%;
      background-color: $bg-body-LM;
      border-radius: $border-radius;
      display: flex;
      align-items: center;
      justify-content: center;

      .instant-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .instant-info {
      display: flex;
      flex-direction: column;
      width: 56%;
      height: 100%;
      padding: 6px 16px 0;

      .card-title {
        font-size: 14px;
        color: $card-title-color-LM;
      }

      .card-description {
        font-size: 12px;
        color: $card-text-color-LM;
        margin-top: 5px;
      }

      .play-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 57px;

        background: $btn-primary-bg-color-LM;
        border-radius: $border-radius;
        border: 1px solid $btn-border-color-LM;

        font-size: 14px;
        color: $text-color-white;

        margin-top: auto;
        max-width: 124px;
      }
    }
  }
}
</style>
