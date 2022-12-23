import { ApiClientStomp, LeaderboardApiWs } from '@ziqni-tech/member-api-client';
import { ref } from 'vue';

export const useGetLeaderboard = () => {
  const leaderboard = ref(null);

  const getEntityLeaderboard = async (contestId) => {
    const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);
    const leaderboardSubscriptionRequest = {
      action: 'Subscribe',
      entityId: contestId,
      leaderboardFilter: {
        ranksAboveToInclude: 10,
        ranksBelowToInclude: 10,
        topRanksToInclude: 1
      }
    };
    await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (res) => {
      leaderboard.value = res.data?.leaderboardEntries;
    });
  }

  return {
    getEntityLeaderboard,
    leaderboard
  }
}