<template>
  <div class="leader-board">
    <div class="leader-board__header">
      <span>player</span>
      <span># Tournaments Played</span>
      <span>Earnings</span>
    </div>
    <LeaderboardItem :place="1" />
    <LeaderboardItem :place="2"  />
    <LeaderboardItem :place="3"  />
    <LeaderboardItem :place="4"  />
    <LeaderboardItem :place="5"  />
  </div>
</template>

<script>
// import { ApiClientStomp,
//   // EntityChangesApiWs,
//   LeaderboardSubscriptionApiWs
// } from '@ziqni-tech/member-api-client';

import { CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell } from '@coreui/vue';
import Avatar from '../../shared/components/Avatar';
import LeaderboardItem from './LeaderboardItem';

export default {
  name: 'Leaderboard',
  components: {
    LeaderboardItem,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    Avatar
  },
  data: () => {
    return {}
  },
  methods: {
    // subscribeToLeaderboard
    getLeaderBord() {
      // const apiClientStomp = ApiClientStomp.instance;
      // const apiLeaderboardWsClient = new LeaderboardSubscriptionApiWs(this.client);
      // const leaderboardSubscriptionRequest = {
      //   action: 'Subscribe', entityId: '',  leaderboardFilter: {
      //     ranksAboveToInclude: 1,
      //     ranksBelowToInclude: 20,
      //     topRanksToInclude: 20
      //   }
      // }
      // apiLeaderboardWsClient.leaderboardSubscription(leaderboardSubscriptionRequest, (data) => {console.log("SYS Callback Data", data)})
    }
  }
};
</script>

<style lang="scss">
.leader-board {
  width: 1035px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 19px 14px 17px;

    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    color: #848589;
  }
}
</style>