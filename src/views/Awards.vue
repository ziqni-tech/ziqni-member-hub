<template>
  <CNav variant="pills" layout="fill" class="achievements-tabs">
    <CNavLink
        :active="activeTabKey === 'available'"
        @click="() => updateActiveTab('available')"
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
  <AvailableAwardsSection v-if="activeTabKey === 'available'" />
  <ClaimedAwardsSection v-if="activeTabKey === 'claimed'" />
  <InstantWinsSection v-if="activeTabKey === 'instantWins'" />
</template>

<script setup>
import { ref } from 'vue';
import { CNav, CNavLink } from '@coreui/vue';
import AvailableAwardsSection from '@/components/awards/AvailableAwardsSection.vue';
import ClaimedAwardsSection from '@/components/awards/ClaimedAwardsSection.vue';
import InstantWinsSection from '@/components/instant-wins/InstantWinsSection.vue';

const activeTabKey = ref('available')

const updateActiveTab = (val) => {
  activeTabKey.value = val;
};

</script>

<style lang="scss" scoped>

</style>