<template>
  <div class="app-layout">
    <Sidebar/>
    <div class="right-part">
      <Navbar :member="member"/>
      <div class="content">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/header/TheHeader';
import Sidebar from '../components/sidebar/TheSidebar';
import useConnect from '../hooks/useConnect';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { ApiClientStomp, MemberRequest, MembersApiWs } from '@ziqni-tech/member-api-client';

export default {
  name: 'AppLayout',
  components: {
    Sidebar,
    Navbar
  },
  data: function () {
    return {
      connection: null,
      member: null,
      client: null
    };
  },
  // async setup() {
  // const { memberData, apiClientStomp } = await useConnect();

  // const store = useStore();
  // await store.dispatch('setMemberAction', memberData);

  // console.log('SETUP MEMBER DATA', memberData);
  // member.value = memberData

  // const member = computed(() => store.state.memberData);
  // console.log('member . value => ', member);

  // return {}
  // },
  created() {
    this.connect()
  },
  methods: {
    connect: async function () {
      const authToken = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5X2lkIjoiSEZEYmhJUUI3UUctTWpNa3dPQTIiLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiNDUyNzc2NzIyODQ5NTI5NSIsImFjY291bnRfaWQiOiJWb1lvdlh3Qm42OWk2elVjSVBBYyIsInNwYWNlX25hbWUiOiJ0ZXN0LXNwYWNlLTEiLCJuYW1lIjoiQ2FybWluZSBMLiIsIm1lbWJlcl90eXBlIjoiSW5kaXZpZHVhbCIsIm1lbWJlcl9pZCI6IlhvTnhjb1FCeTZhenVmT1RNdzhWIiwicmVzb3VyY2VfYWNjZXNzIjp7InppcW5pLWdhcGkiOnsicm9sZXMiOlsiUHVibGljIiwiTWVtYmVyIiwiVmlld0FjaGlldmVtZW50cyIsIlZpZXdBd2FyZHMiLCJDbGFpbUF3YXJkcyIsIlZpZXdDb21wZXRpdGlvbnMiLCJWaWV3Q29udGVzdHMiLCJWaWV3RmlsZXMiLCJWaWV3TWVtYmVycyIsIk1lbWJlcnNPcHRpbiIsIlZpZXdNZXNzYWdlcyIsIkNvbm5lY3RQcm94eSIsIlZpZXdSZXdhcmRzIiwiVmlld1J1bGVzIl19fSwic3ViIjoiWG9OeGNvUUJ5NmF6dWZPVE13OFYiLCJqdGkiOiI5YTlkZGQ2OS04NmY4LTQ2NjEtYWJkMS02MjQ1MjhkYWYzNTYiLCJpYXQiOjE2Njg3NzY2MzQsImV4cCI6MTY3MDkzNjYzNH0.2YfBoMPIM2JQF0xGU6LaikTZd8Uu2DVA3EC6Gw3qlx0"
      const apiClientStomp = ApiClientStomp.instance;

      await apiClientStomp.connect({token: authToken})
      this.client = apiClientStomp

      const memberRequest = MemberRequest.constructFromObject(
          {
            'includeFields': [],
            'includeCustomFields': [],
            'includeMetaDataFields': []
          },
          null);
      const memberApiWsClient = new MembersApiWs(apiClientStomp);

      memberApiWsClient.getMember(memberRequest, (data) => {
        console.log('DATA', data);
        // this.member = data.data;
        this.$store.dispatch('setMemberAction', data.data);
      });

    },
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/variables';

.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;

  .right-part {
    display: flex;
    flex-direction: column;
    width: 100%;

    .content {
      width: 100%;
      height: 100%;
      background: $bg-primary-light-purplish-blue;
    }
  }
}
</style>