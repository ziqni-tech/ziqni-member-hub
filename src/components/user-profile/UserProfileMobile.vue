<template>
  <div id="user-profile-mobile" :class="{ open: isProfileInfo, 'light-mode': !isDarkMode }">
    <div class="background-block" >
      <div class="buttons">
        <ToggleTheme
            class="theme-btn"
            :stroke-color="getIconStrokeColor()"
            :iconSize="'40'"
        />
        <div class="cross-btn" v-if="isMobile" @click="closeProfileInfo">
          <CrossIcon :width="'40'" :height="'40'" :stroke-color="getIconStrokeColor()"/>
        </div>
      </div>

      <div class="greetings">
        Hi,
        <img class="user-avatar" :src="member.iconLink ? member.iconLink : memberDefaultIcon" alt="">
         <span v-if="isClientConnected">{{ member.name }}!</span>
      </div>
      <div class="recent-trips">
        <span>Recent trips</span>
        <div class="trips-block">
          <TripCard class="trip-card" />
          <TripCard class="trip-card"  />
          <TripCard class="trip-card"  />
          <TripCard class="trip-card"  />
          <TripCard class="trip-card"  />
        </div>
      </div>
    </div>

    <div class="menu-block">
      <ul class="user-menu">
        <li class="menu-item">
          <img src="@/assets/icons/user-info/message.svg" alt="">
          Start a chart
        </li>
        <li class="menu-item">
          <img src="@/assets/icons/user-info/shield-tick.svg" alt="">
          Renew your policy
        </li>
        <li class="menu-item">
          <img src="@/assets/icons/user-info/info-circle.svg" alt="">
          Had a crash? Get help
        </li>
        <li class="menu-item logout" @click="logOut">
          <Logout />
          logout
        </li>
      </ul>

    </div>


  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import ProfileInfoCircleProgress from './ProfileInfoCircleProgress';
import ToggleTheme from '@/shared/components/ToggleTheme.vue';
import useMobileDevice from '@/hooks/useMobileDevice';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';
import memberDefaultIcon from '@/assets/images/user/avatar.png';
import CrossIcon from '@/shared/components/svg-icons/CrossIcon.vue';
import TripCard from '@/components/dashboard/TripCard.vue';
import Logout from '@/components/sidebar/svg-icons/Logout.vue';

const store = useStore();
const { isMobile } = useMobileDevice();
const emit = defineEmits(['closeProfileInfo', 'logOut']);
const isClientConnected = computed(() => store.getters.getIsConnectedClient);

const props = defineProps({
  isProfileInfo: {
    type: Boolean,
    default: false
  }
});

const isDarkMode = computed(() => store.getters.getTheme);

const getIconStrokeColor = () => {
  return '#FFFFFF';
};

const closeProfileInfo = () => {
  emit('closeProfileInfo');
};

const logOut = () => {
  emit('logOut');
};

const member = computed(() => store.getters.getMember);

const totalGames = ref(0);
const totalPoints = ref(0);
const wins = ref(0);
const losses = ref(0);
const achievements = ref([]);

const winPercentage = computed(() => {
  if (totalGames.value === 0) {
    return 0;
  }
  const percentage = (wins.value / totalGames.value) * 100;
  return Math.round(percentage);
});

const lossPercentage = computed(() => {
  if (totalGames.value === 0) {
    return 0;
  }
  const percentage = (losses.value / totalGames.value) * 100;
  return Math.round(percentage);
});

onMounted(() => {
  getAchievementsRequest();
});

const getAchievementsRequest = async () => {
  try {
    const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);
    let totalFetched = 0;
    let moreDataAvailable = true;

    while (moreDataAvailable) {
      const achievementsRequest = AchievementRequest.constructFromObject({
        achievementFilter: {
          productTagsFilter: [],
          ids: [],
          tags: ['dashboard'],
          status: [],
          sortBy: [
            {
              queryField: 'created',
              order: 'Desc'
            },
          ],
          skip: totalFetched,
          limit: 20,
          statusCode: {
            moreThan: 0,
            lessThan: 40
          },
          constraints: []
        },
      }, null);

      const response = await new Promise((resolve, reject) => {
        achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
          resolve(res);
        });
      });

      const achievementsData = response.data

      totalGames.value = response.meta.totalRecordsFound

      const ids = response.data.map(item => item.id);
      const statusData = await getOptInStatus(ids);

      for (const status of statusData.data) {
        for (const achievement of achievementsData) {
          if (status.entityId === achievement.id) {
            totalPoints.value += status.points || 0

            const isFinished = achievement.status === 'Finished' || achievement.status === 'Finishing';
            const isWinner = status.percentageComplete === 100;

            if (isWinner) {
              wins.value++;
            } else if (isFinished && !isWinner) {
              losses.value++;
            }
          }
        }
      }

      achievements.value = [...achievements.value, ...response.data];
      totalFetched += response.data.length;


      if (totalFetched >= response.meta.totalRecordsFound) {
        moreDataAvailable = false; // Terminate the loop if limits are reached
      }
    }
  } catch (err) {

  }
};

const getOptInStatus = async (ids) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Achievement'],
      ids: ids,
      statusCodes: {
        gt: -5,
        lt: 40
      },
      skip: 0,
      limit: 20
    }
  }, null);

  return await new Promise((resolve, reject) => {
    optInApiWsClient.optInStates(optInStateRequest, res => {
      resolve(res);
    }, err => {
      reject(err);
    });
  });
};

</script>

<style lang="scss">
@import "src/assets/scss/_variables";

#user-profile-mobile {
  display: flex;
  flex-direction: column;
  background-color: $bg-secondary-LM;
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  height: 100%;
  transition: right 0.3s ease-in-out;
  z-index: 10;

  .background-block {
    padding: 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 54%;
    overflow: hidden;
    background: linear-gradient(180deg, #41B2A1 0%, #199FC7 100%);
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;

    .greetings {
      width: 100%;
      display: flex;
      align-items: center;
      margin-top: 25px;
      text-align: left;
      color: #FFF;

      font-size: 22px;
      font-style: normal;
      font-weight: 700;

      .user-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin: 0 5px;
      }
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .theme-btn {
        background-color: inherit;
        border-radius: 5px;
        border: 1px solid rgba(230, 230, 230, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;

      }

      .cross-btn {
        padding: 0;
        background-color: inherit;
        border-radius: 5px;
        border: 1px solid rgba(230, 230, 230, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .recent-trips {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #FFF;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      margin-top: 30px;

      .trips-block {
        width: 100%;
        margin-top: 15px;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        overflow-x: scroll;

        &::-webkit-scrollbar {
          width: 0;
        }

        .trip-card {
          width: 80%;
          margin-right: 10px;
        }
      }
    }
  }

  .menu-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding-top: 30px;

    .user-menu {
      width: 100%;
      padding: 0 12px;

      .menu-item {
        text-align: start;
        color: #253241;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;

        & > img {
          margin-right: 5px;
        }
      }

      .menu-item.logout {
        color: #F0047E;
        & > svg {
          margin-right: 5px;
        }
      }

      .menu-item:not(:last-child) {
        margin-bottom: 30px;
      }
    }
  }



  .logout-mobile-btn {
    width: 320px;
    margin: 0 auto 20px;
    padding: 10px;
    border-radius: $border-radius;
    border: 1px solid #EB5757;
    background: none;

    font-weight: 700;
    font-size: 12px;
    line-height: 14px;

    color: $text-color-white;
  }

  &.light-mode {
    background-color: $bg-secondary-LM;

    .user-info {
      .user-name {
        color: $section-title-color-LM;
      }
    }

    .border-block {
      border-bottom: 1px solid $main-border-color-LM;
    }

    .logout-mobile-btn {
      width: 320px;
      margin: 0 auto 20px;
      padding: 10px;
      border-radius: $border-radius;
      border: 1px solid #EB5757;
      background: none;

      font-weight: 700;
      font-size: 12px;
      line-height: 14px;

      color: $card-title-color-LM;
    }
  }
}

#user-profile-mobile.open {
  right: 0;
}
</style>