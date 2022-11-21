<template>
  <div class="page-header">
    <UserProfile :name="memberData?.name" />
    <Welcome :name="memberData?.name" />
    <UserProgress />
    <UserEnergy :energy-value="1200" :increment-energy-value="5" />
    <Notifications :number-of-notifications="5" />
    <GameModeSwitch />
  </div>
</template>

<script>
import { CNavbar } from '@coreui/vue';
import UserProfile from './UserProfile';
import Welcome from './Welcome';
import UserProgress from './UserProgress';
import UserEnergy from './UserEnergy';
import Notifications from './Notifications';
import GameModeSwitch from './GameModeSwitch';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import useConnect from '../../hooks/useConnect';

export default {
  name: 'Header',
  components: {
    CNavbar,
    UserProfile,
    Welcome,
    UserProgress,
    UserEnergy,
    Notifications,
    GameModeSwitch
  },
  props: {
    member: Object
  },
  setup() {
    // const memberData = ref();
    const store = useStore();

    const memberData = computed(() => store.state.memberData);
    console.log('header data', memberData);

    return {memberData}
  },
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 29px 33px 15px 46px;
  background: $bg-primary-light-purplish-blue;
  border-bottom: 0.2px solid $border-color;
}

</style>