<template>
  <div class="section" :class="{'light-mode': !isDarkMode}">
    <div class="section-header">
      <h2 class="section-title" v-if="isDashboard">Instant Wins</h2>
      <router-link :to="{ path: '/awards', query: { tab: 'instantWins' } }">
        <div v-if="isDashboard" class="see-all-btn">See all</div>
      </router-link>
    </div>
    <div class="content-wrapper">
      <Loader v-if="!isLoaded"/>
      <div
        v-if="isLoaded"
        :class="isDashboard ? 'instant-cards-dashboard-grid' : 'instant-cards-grid'"
        :key="rerenderKey"
      >
        <div v-if="wheels.length === 0">
          <InstantWinsCard
            :img="wheelImg"
            :title="singleWheelTitle"
            :description="description"
            @play="goToSingleWheel('1')"
            :isDarkMode="isDarkMode"
          />
        </div>
        <div
          v-for="wheel in wheels"
          :key="wheel.id"
          :class="{'light-mode': !isDarkMode}"
        >
          <div>
            <InstantWinsWheelCard
              :wheelId="wheel.id"
              :img="wheelImg"
              :title="wheel.name"
              :description="wheel.description"
              :tiles="wheel.tiles"
              :settingsData="wheel.settingsData"
              :isDarkMode="isDarkMode"
              @play="goToSingleWheel(wheel.id)"
            />
          </div>
        </div>
        <div>
<!--          <InstantWinsCard-->
<!--            :img="scratchcardImg"-->
<!--            :title="scratchcardsTitle"-->
<!--            :description="description"-->
<!--            @play="scratchcardsPlay"-->
<!--            :isDarkMode="isDarkMode"-->
<!--          />-->
        </div>
      </div>
    </div>
  </div>
  <AwardsListModal
    :modal-show="showAwardsModal"
    @closeModal="closeModal"
    :isDarkMode="isDarkMode"
    @selectAward="goToPlay"
  />
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import InstantWinsCard from './InstantWinsCard';
import AwardsListModal from '@/components/awards/AwardsListModal.vue';
import { ApiClientStomp, FilesApiWs, InstantWinsApiWs } from '@ziqni-tech/member-api-client';

import singleWheelImg from '@/assets/images/instant-wins/single-wheel.png';
import singleWheelImgLight from '@/assets/images/instant-wins/single-wheel_light.png';
import scratchcardsImg from '@/assets/images/instant-wins/scratchcard.png';
import scratchcardsImgLight from '@/assets/images/instant-wins/scratchcard_light.png';
import InstantWinsWheelCard from '@/components/instant-wins/InstantWinsWheelCard.vue';
import Loader from '@/components/Loader.vue';

const singleWheelTitle = 'The Single Wheel';
const scratchcardsTitle = 'Scratchcards';
const description = 'Short description about this instant win';

const store = useStore();
const router = useRouter();

const isDarkMode = computed(() => store.getters.getTheme);
const wheelImg = computed(() => (isDarkMode.value ? singleWheelImg : singleWheelImgLight));
const scratchcardImg = computed(() => (isDarkMode.value ? scratchcardsImg : scratchcardsImgLight));

const wheels = ref([]);
const spinnerContainers = ref({});
const showAwardsModal = ref(false);
const wheelId = ref('');
const isLoaded = ref(false);
const rerenderKey = ref(0);

const props = defineProps({
  isDashboard: {
    type: Boolean,
    default: false,
  },
});

const scratchcardsPlay = () => {
  router.push({ name: 'Scratchcards' });
};

const goToSingleWheel = (id) => {
  wheelId.value = id;

  router.push({
    name: 'SingleWheel',
    params: {
      id: wheelId.value,
    },
  });
};

const goToPlay = (awardId) => {
  showAwardsModal.value = false;
  router.push({
    name: 'SingleWheel',
    params: {
      id: wheelId.value,
    },
    query: {
      awardId: awardId,
    },
  });
};

const closeModal = () => {
  showAwardsModal.value = false;
};

onMounted(async () => {
  let instantWins = await getInstantWins();
  if (props.isDashboard) {
    instantWins = instantWins.slice(0, 2);
  }

  for (const instantWin of instantWins) {
    const { id, tiles, settingsData } = instantWin;
    wheels.value.push(instantWin);

    await nextTick(); // Ensure the DOM is updated before accessing the ref

    const spinnerContainer = spinnerContainers.value[id];
  }
  isLoaded.value = true;
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  // Cleanup if needed
  window.removeEventListener('resize', handleResize);
});

const handleResize = async () => {
  rerenderKey.value++
  // wheels.value = [];
  // await getInstantWins()
};

const getInstantWins = () => {
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
          languageKey: '',
          currencyKey: '',
        },
        async (res) => {
          const instantWinsData = res.data;
          const wheels = instantWinsData.filter((item) => item.instantWinType === 1);

          const instantWinsWithSettings = await Promise.all(
            wheels.map(async (wheel) => {
              try {
                const settingsData = await getSettingsFile(wheel).catch((err) => {
                  console.log(`Error fetching settings for wheel id: ${wheel.id}`, err);
                  return null;
                });

                if (!settingsData) {
                  console.log(`No settings found for wheel id: ${wheel.id}`);
                  return null;
                }

                const tiles = wheel.tiles;

                if (settingsData.wheelSettings) {
                  await replaceImageIdsWithUris(settingsData.wheelSettings);
                }

                if (settingsData.messageSettings) {
                  await replaceImageIdsWithUris(settingsData.messageSettings);
                }

                return {
                  id: wheel.id,
                  name: wheel.name,
                  description: wheel.description,
                  tiles,
                  settingsData,
                };
              } catch (error) {
                console.log(`Error processing wheel id: ${wheel.id}`, error);
                return null;
              }
            })
          );

          const filteredInstantWins = instantWinsWithSettings.filter((win) => win !== null);

          resolve(filteredInstantWins);
        }
      );
    } catch (err) {
      console.log('Error in getInstantWins:', err);
      reject(err);
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
    console.error(`Error fetching settings file for ${file}:`, error);
    return null;
  }
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

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

.section {
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0;
  }

  .instant-cards-dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 15px;
  }

  .instant-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    grid-gap: 8px;

    @media screen and (max-width: $phoneWidth) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 8px;
    }
  }

  &.light-mode {
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    .section-header {
      .section-title {
        color: $section-title-color-LM;
      }
    }
  }
}

</style>
