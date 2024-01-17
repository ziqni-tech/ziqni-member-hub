<template>
  <div class="page-content">
    <CNav
        variant="pills"
        layout="fill"
        class="achievements-tabs"
        :class="{'light-mode': !isDarkMode}"
    >
      <CNavLink
          :active="activeTabKey === 'all'"
          @click="() => updateActiveTab('all')"
      >
        All
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'daily'"
          @click="() => updateActiveTab('daily')"
      >
        Daily
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'weekly'"
          @click="() => updateActiveTab('weekly')"
      >
        Weekly
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'monthly'"
          @click="() => updateActiveTab('monthly')"
      >
        Monthly
      </CNavLink>
    </CNav>
    <AllAchievementsSection v-if="activeTabKey === 'all'" />
    <DailyAchievementsSection v-if="activeTabKey === 'daily'" />
    <WeeklyAchievementsSection v-if="activeTabKey === 'weekly'" />
    <MonthlyAchievementsSection v-if="activeTabKey === 'monthly'" />
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { ApiClientStomp } from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';
import { CNav, CNavLink } from '@coreui/vue';
import DailyAchievementsSection from '@/components/achievements/DailyAchievementsSection.vue';
import WeeklyAchievementsSection from '@/components/achievements/WeeklyAchievementsSection.vue';
import MonthlyAchievementsSection from '@/components/achievements/MonthlyAchievementsSection.vue';
import AllAchievementsSection from '@/components/achievements/AllAchievementsSection.vue';

const store = useStore();

const activeTabKey = computed(() => store.getters.getCurrentTab.length
    ? store.getters.getCurrentTab
    : 'all');

const isDarkMode = computed(() => store.getters.getTheme);

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

const updateActiveTab = (val) => {
  store.dispatch('setCurrentTab', val);
  store.dispatch('setCurrentPage', 1);
};

</script>

<style lang="scss">

</style>