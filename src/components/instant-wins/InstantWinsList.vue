<template>
  <div :class="isDashboard ? 'achievements-dashboard-cards-grid' : 'achievements-cards-grid'">
      <div
        v-for="wheel in wheels"
        :key="wheel.id"
        class="instant-wins-card"
        :class="{'light-mode': !isDarkMode}"
      >
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
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { createSpinnerWheel } from 'spinning-wheel';
import { ApiClientStomp, FilesApiWs, InstantWinsApiWs } from '@ziqni-tech/member-api-client';
import { useRouter } from 'vue-router';

const wheels = ref([]);
const spinnerContainers = ref({});
const router = useRouter()

const setSpinnerContainerRef = (id) => (el) => {
  if (el) {
    spinnerContainers.value[id] = el;
  }
};

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false
  }
});

onMounted(async () => {
  console.log('props', props);
  let instantWins = await getInstantWin();
  console.warn('onMounted instantWins =>', instantWins);
  if (props.isDashboard) {
    instantWins = instantWins.slice(0, 1);
  }

  for (const instantWin of instantWins) {
    const { id, tiles, settingsData } = instantWin;
    console.log('onMounted instantWin', instantWin);
    wheels.value.push(instantWin);

    await nextTick(); // Ensure the DOM is updated before accessing the ref

    const spinnerContainer = spinnerContainers.value[id];
    if (spinnerContainer) {
      const { isCreated, spinWheel, resetWheel } = await createSpinnerWheel(
        spinnerContainer,
        tiles,
        settingsData,
        (giftValue) => {

        },
        true
      );
      console.log('onMounted wheels.value', wheels.value);

    }
  }
});

const getInstantWin = () => {
  console.log('getInstantWin PROPS', props);
  return new Promise(async (resolve, reject) => {
    try {
      const instantWinApiWsClient = new InstantWinsApiWs(ApiClientStomp.instance);
      instantWinApiWsClient.listInstantWins({
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
          statusCode: []
        },
        languageKey: 'string',
        currencyKey: 'string'
      }, async (res) => {
        console.log('getInstantWin RES', res);
        const instantWinsData = res.data;
        const wheels = instantWinsData.filter(item => item.instantWinType === 1);

        // Use Promise.all to wait for all async operations to complete
        const instantWinsWithSettings = await Promise.all(wheels.map(async (wheel) => {
          const settingsData = await getSettingsFile(wheel.id);
          console.log('settingsData =>', settingsData);
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
            settingsData
          };
        }));

        resolve(instantWinsWithSettings);
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

const getFileUri = async (id) => {
  const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

  const fileRequest = {
    ids: [id],
    limit: 1,
    skip: 0
  };

  return new Promise((resolve) => {
    fileApiWsClient.getFiles(fileRequest, (res) => {
      resolve(res.data && res.data[0] ? res.data[0].uri : null);
    });
  });
};

const goToSingleWheel = (id) => {
  console.log('goToSingleWheel => ', id);
  router.push({
    name: 'SingleWheel',
    params: {
      id: id,
    },
  })
}


</script>

<style scoped lang="scss">
.wheel-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px; /* Adjust as needed */
}

.wheel-card {
  width: 300px; /* Adjust as needed */
  height: 300px; /* Adjust as needed */
}

.spinner-container {
  width: 100%;
  height: 100%;
}

@import '@/assets/scss/_variables';

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
      margin-top: 10px;
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
        margin-top: 10px;
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
        color: $white-color-DM;

        margin-top: auto;
        max-width: 124px;
      }
    }
  }
}

@media screen and (max-width: 1280px) {
  .instant-wins-card {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-radius: $border-radius;
    background-color: $card-bg-DM;

    width: 100%;

    .mobile-card-title {
      display: flex;
      width: 100%;
      justify-content: center;
      padding-bottom: 15px;
      font-size: 12px;
      font-family: $bold;
      color: $white-color-DM;
    }

    .instant-img-wrapper {
      width: 100%;
      background-color: $prize-btn-bg-DM;
      border-radius: $border-radius;
      padding-bottom: 75%;
      position: relative;
      overflow: hidden;

      .instant-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .instant-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 0;

      .card-title {
        display: none;
      }

      .card-description {
        display: none;
      }

      .play-btn {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 6px;

        font-family: $bold;;
        font-size: 12px;
        line-height: 14px;
        color: $white-color-DM;

        margin-top: auto;
      }
    }
    &.light-mode {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-radius: $border-radius;
      width: 100%;

      .mobile-card-title {
        display: flex;
        width: 100%;
        justify-content: center;
        padding-bottom: 15px;
        font-size: 14px;
        color: $section-title-color-LM;
      }

      .instant-img-wrapper {
        width: 100%;
        border-radius: $border-radius;
        padding-bottom: 75%;
        position: relative;
        overflow: hidden;

        .instant-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .instant-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 0;

        .card-title {
          display: none;
        }

        .card-description {
          display: none;
        }

        .play-btn {
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          padding: 6px;

          border-radius: $border-radius;

          font-family: $bold;;
          font-size: 12px;
          line-height: 14px;
          color: $text-color-white;

          margin-top: auto;
        }
      }
    }
  }
}
</style>
