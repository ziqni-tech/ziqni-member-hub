<template>
  <div class="page-content">
    <CNav
        variant="pills"
        layout="fill"
        class="achievements-tabs"
        :class="{'light-mode': !isDarkMode}"
    >
      <CNavLink
          :active="activeTabKey === 'available'"
          @click="() => updateActiveTab('available')"
          :disabled="!isAvailableAwardsActive"
      >
        available
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'claimed'"
          @click="() => updateActiveTab('claimed')"
      >
        claimed
      </CNavLink>
      <CNavLink
          :active="activeTabKey === 'instantWins'"
          @click="() => updateActiveTab('instantWins')"
      >
        Instant wins
      </CNavLink>
    </CNav>
    <AvailableAwardsSection v-if="activeTabKey === 'available'" @setIsAvailableAwards="setIsAvailableAwards"/>
    <ClaimedAwardsSection v-if="activeTabKey === 'claimed'"/>
    <InstantWinsSection v-if="activeTabKey === 'instantWins'"/>
  </div>

</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { CNav, CNavLink } from '@coreui/vue';
import AvailableAwardsSection from '@/components/awards/AvailableAwardsSection.vue';
import ClaimedAwardsSection from '@/components/awards/ClaimedAwardsSection.vue';
import InstantWinsSection from '@/components/instant-wins/InstantWinsSection.vue';
import { useStore } from 'vuex';
import { ApiClientStomp } from '@ziqni-tech/member-api-client';

const activeTabKey = computed(() => store.getters.getCurrentTab.length
    ? store.getters.getCurrentTab
    : 'available');
const store = useStore();

onBeforeMount(async () => {
  ApiClientStomp.instance.client.debug = () => {
  };
  await ApiClientStomp.instance.connect({ token: localStorage.getItem('token') });
  await store.dispatch('setIsConnectedClient', true);
});

const isDarkMode = computed(() => store.getters.getTheme);
const updateActiveTab = (val) => {
  store.dispatch('setCurrentTab', val);
  store.dispatch('setCurrentPage', 1);
};

const isAvailableAwardsActive = ref(true);
const setIsAvailableAwards = () => {
  isAvailableAwardsActive.value = false;
};

</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

.achievements-tabs {
  &.light-mode {
    background-color: $card-bg-LM;
  }
}
</style>