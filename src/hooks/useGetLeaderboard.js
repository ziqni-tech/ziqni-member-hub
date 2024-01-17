import { ApiClientStomp, LeaderboardApiWs } from '@ziqni-tech/member-api-client';
import { useStore } from 'vuex';

export const useGetLeaderboard = () => {
  const store = useStore()

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
    await store.dispatch('leaderboardRequest');

    await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (res) => {
      if (!res.errors.length) {
        store.dispatch('setLeaderboardAction', res.data.leaderboardEntries)
      } else {
        store.dispatch('setLeaderboardErrorAction', res.errors)
      }
    });
  }

  return {
    getEntityLeaderboard
  }
}