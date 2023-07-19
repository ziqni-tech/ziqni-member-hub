<template>
  <div id="user-profile">
    <div class="background-block" :style="{ 'background-image': `url(${require('@/assets/images/user/cover.png')})` }">
      <div class="buttons">
        <button class="btn">
          <NotificationIcon
              :strokeColor="'#FFFFFF'"
              :width="'40'"
              :height="'40'"
          />
        </button>
        <ToggleTheme class="btn" :class="{'isMoon-icon': !isDarkMode}" :stroke-color="'#FFFFFF'" />
      </div>
    </div>
    <div class="user-info">
      <div class="user-image-wrapper">
        <div class="user-image">
          <img :src="member.iconLink ? member.iconLink : memberDefaultIcon" alt="">
        </div>
      </div>
      <div class="user-name" :class="{'light-mode': !isDarkMode}">{{ member.name }}</div>
      <div class="pro-label">pro</div>
      <div class="info-block">
        <ProfileInfoCircleProgress
            :color="'#BEE9F3'"
            :title="'Total game'"
            :completed-steps="totalGames"
            :total-steps="100"
            :is-dark-mode="isDarkMode"
        />
        <ProfileInfoCircleProgress
            :color="'#8749DC'"
            :title="'Points'"
            :completed-steps="1200"
            :total-steps="10000"
            :is-dark-mode="isDarkMode"
        />
        <ProfileInfoCircleProgress
            :color="'#6FCF97'"
            :title="'win'"
            :completed-steps="winPercentage"
            :total-steps="100"
            :is-percents="true"
            :is-dark-mode="isDarkMode"
        />
        <ProfileInfoCircleProgress
            :color="'#EB5757'"
            :title="'lose'"
            :completed-steps="lossPercentage"
            :total-steps="100"
            :is-percents="true"
            :is-dark-mode="isDarkMode"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import ProfileInfoCircleProgress from './ProfileInfoCircleProgress';
import ToggleTheme from '@/shared/components/ToggleTheme.vue';
import {
  AchievementRequest,
  AchievementsApiWs,
  ApiClientStomp,
  OptInApiWs,
  OptInStatesRequest
} from '@ziqni-tech/member-api-client';
import NotificationIcon from "@/shared/components/svg-icons/NotificationIcon.vue";
import memberDefaultIcon from "@/assets/images/user/avatar.png";

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);
const member = computed(() => store.getters.getMember);
const totalGames = ref(0);
const wins = ref(0);
const losses = ref(0);

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
})


const getAchievementsRequest = async () => {
  const achievementsApiWsClient = new AchievementsApiWs(ApiClientStomp.instance);

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
      skip: 0,
      limit: 20,
      statusCode: {
        moreThan: 0,
        lessThan: 40
      },
      constraints: []
    },
  }, null);

  achievementsApiWsClient.getAchievements(achievementsRequest, (res) => {
    // totalGames.value = res.meta.totalRecordsFound;
    const ids = res.data.map(item => item.id);
    getOptInStatus(ids);
  });
};

const getOptInStatus = async (ids) => {
  const optInApiWsClient = new OptInApiWs(ApiClientStomp.instance);

  const optInStateRequest = OptInStatesRequest.constructFromObject({
    optinStatesFilter: {
      entityTypes: ['Achievement'],
      ids,
      statusCodes: {
        gt: -5,
        lt: 40
      },
      skip: 0,
      limit: 20
    }
  }, null);

  await optInApiWsClient.optInStates(optInStateRequest, res => {
    if (res.data && res.data.length) {
      totalGames.value = res.data.length;
      res.data.forEach((item) => {
        if (item.percentageComplete === 100) {
          wins.value++;
        } else {
          losses.value++;
        }
      });
    }
  });
};
</script>

<style lang="scss">
@import "src/assets/scss/_variables";

#user-profile {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: inherit;
  font-family: $semi-bold;

  .background-block {
    display: flex;
    flex-direction: column;
    position: relative;
    height: 24%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .buttons {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 12px;

      .btn {
        padding: 0;
        border-radius: 5px;
        border: 1px solid rgba(230, 230, 230, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;

        &.isMoon-icon {
          padding: 10px;
        }
      }
    }
  }

  .user-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 42px;

    .user-image-wrapper {
      position: absolute;
      top: -68px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: $purple;
      display: flex;
      align-items: center;
      justify-content: center;

      .user-image {
        width: 92px;
        height: 92px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 4px solid $border-dark;
        background-color: $body-text-color;
        overflow: hidden;

        > img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }

    .user-name {
      font-style: normal;
      font-size: 16px;
      color: $sidebar-text-color;

      &.light-mode {
        color: $section-title-color-LM;
      }
    }

    .pro-label {
      margin-top: 5px;
      border-radius: 5px;
      text-transform: uppercase;
      background: $purple;
      color: $text-color-white;
      padding: 0 10px;
      font-size: 12px;
    }

    .info-block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
      gap: 41px 16px;
      margin-top: 50px;
    }
  }
}
</style>