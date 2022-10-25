<template>
  <div class="app-layout">
    <Sidebar />
    <div class="right-part">
      <Navbar :member="member" />
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/header/TheHeader';
import Sidebar from '../components/sidebar/TheSidebar';
import { ApiClientStomp, MembersApiWs, MemberRequest } from '@ziqni-tech/member-api-client';

export default {
  name: 'AppLayout',
  components: {
    Sidebar,
    Navbar
  },
  data: function() {
    return {
      connection: null,
      member: null
    }
  },
  created: function() {
    this.connect()
  },
  methods: {
    connect: async function () {
      const authToken = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5X2lkIjoicXhtcXFZRUJUZVV0U0VzNEVJLWgiLCJtZW1iZXJfcmVmZXJlbmNlX2lkIjoiVGVzdF9rZXktMDYwNzg0NGYtMjU1Yy00ZDE5LTg1YTAtYzQzNmMxZDRmNTVlIiwiYWNjb3VudF9pZCI6IkY3bThkSHdCc3ctT0gzTUVvVzIzIiwic3BhY2VfbmFtZSI6ImZpcnN0LXNwYWNlIiwibmFtZSI6IlRlc3RfbmFtZS0zYWE1YzRlZS1jY2VlLTRiZWMtYjU5My1kYTdiMzAwZWU4OTAiLCJtZW1iZXJfdHlwZSI6IkluZGl2aWR1YWwiLCJtZW1iZXJfaWQiOiJ3LVVlSElJQnVwTjhDRjN6YzBoeiIsInJlc291cmNlX2FjY2VzcyI6eyJ6aXFuaS1nYXBpIjp7InJvbGVzIjpbIlB1YmxpYyIsIk1lbWJlciIsIlZpZXdBY2hpZXZlbWVudHMiLCJWaWV3QXdhcmRzIiwiQ2xhaW1Bd2FyZHMiLCJWaWV3Q29tcGV0aXRpb25zIiwiVmlld0NvbnRlc3RzIiwiVmlld0ZpbGVzIiwiVmlld01lbWJlcnMiLCJNZW1iZXJzT3B0aW4iLCJWaWV3TWVzc2FnZXMiLCJDb25uZWN0UHJveHkiLCJWaWV3UmV3YXJkcyIsIlZpZXdSdWxlcyJdfX0sInN1YiI6InctVWVISUlCdXBOOENGM3pjMGh6IiwianRpIjoiZjU5MDIwYmUtNDdiZS00OGM1LTk1ZmUtODc1OTU0NGY0MDM2IiwiaWF0IjoxNjY2NjAxODMxLCJleHAiOjE2Njg3NjE4MzF9.PULMnFGWyHUKPtZOryH3cfeskUgy5saIwG1RBkIaX58"
      const apiClientStomp = ApiClientStomp.instance;

      await apiClientStomp.connect({token: authToken})
      this.client = apiClientStomp

      const memberApiWsClient = new MembersApiWs(this.client)

      const memberRequest = MemberRequest.constructFromObject(      {
        "includeFields": [],
        "includeCustomFields": [],
        "includeMetaDataFields": []
      }, null)

      memberApiWsClient.getMember( memberRequest ,(data) => {
        this.member = data.data;
        console.log('getMember data', data)
      })
    },
  }
}
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