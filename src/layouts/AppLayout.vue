<template>
  <div class="app-layout" v-if="isReady">
    <Sidebar/>
    <div class="right-part">
      <Navbar :member="member" />
      <div class="page-content">
        <slot/>
      </div>
    </div>
  </div>
  <div class="spinner-wrapper" v-else>
    <CSpinner class="spinner" color="secondary"/>
  </div>
</template>

<script>
import { CSpinner } from '@coreui/vue';
import Navbar from '../components/header/TheHeader';
import Sidebar from '../components/sidebar/TheSidebar';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';

export default {
  name: 'AppLayout',
  data: function () {
    return {
      connection: null,
      member: null,
      client: null,
      isReady: false
    };
  },
  components: {
    Sidebar,
    Navbar,
    CSpinner
  },
  created() {
    this.connect()
  },
  methods: {
    connect: async function () {
      const authToken = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5X2lkIjoiSEZEYmhJUUI3UUctTWpNa3dPQTIiLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiNDUyNzc2NzIyODQ5NTI5NSIsImFjY291bnRfaWQiOiJWb1lvdlh3Qm42OWk2elVjSVBBYyIsInNwYWNlX25hbWUiOiJ0ZXN0LXNwYWNlLTEiLCJuYW1lIjoiQ2FybWluZSBMLiIsIm1lbWJlcl90eXBlIjoiSW5kaXZpZHVhbCIsIm1lbWJlcl9pZCI6IlhvTnhjb1FCeTZhenVmT1RNdzhWIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWdhcGkiOnsicm9sZXMiOlsiUHVibGljIiwiTWVtYmVyIiwiVmlld0FjaGlldmVtZW50cyIsIlZpZXdBd2FyZHMiLCJDbGFpbUF3YXJkcyIsIlZpZXdDb21wZXRpdGlvbnMiLCJWaWV3Q29udGVzdHMiLCJWaWV3RmlsZXMiLCJWaWV3TWVtYmVycyIsIk1lbWJlcnNPcHRpbiIsIlZpZXdNZXNzYWdlcyIsIkNvbm5lY3RQcm94eSIsIlZpZXdSZXdhcmRzIiwiVmlld1J1bGVzIl19fSwic3ViIjoiWG9OeGNvUUJ5NmF6dWZPVE13OFYiLCJqdGkiOiI5YTlkZGQ2OS04NmY4LTQ2NjEtYWJkMS02MjQ1MjhkYWYzNTYiLCJpYXQiOjE2Njg3NzY2MzQsImV4cCI6MTY3MDkzNjYzNH0.2YfBoMPIM2JQF0xGU6LaikTZd8Uu2DVA3EC6Gw3qlx0"
      await ApiClientStomp.instance.connect({token: authToken})

      const memberRequest = MemberRequest.constructFromObject(
          {
            'includeFields': [],
            'includeCustomFields': [],
            'includeMetaDataFields': []
          },
          null);

      const memberApiWsClient = new MembersApiWs(ApiClientStomp.instance);
      memberApiWsClient.getMember(memberRequest, (data) => {
        this.member = data.data;
        this.$store.dispatch('setMemberAction', data.data);
        this.isReady = true;
      });

      // const apiLeaderboardWsClient = new LeaderboardApiWs(apiClientStomp);
      // const leaderboardSubscriptionRequest = {
      //   action: 'Subscribe',
      //   entityId: 'n38yUoQBSPM0WYwFnk1B',
      //   leaderboardFilter: {
          // ranksAboveToInclude: 1,
          // ranksBelowToInclude: 20,
          // topRanksToInclude: 20
      //   }
      // };
      // apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (data) => {
      //   console.log('LEADERBOARD', data);
      // });

    },
  }
};
</script>

<style lang="scss">
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .right-part {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
</style>