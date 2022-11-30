<template>
  <div class="page-container" v-if="isReady">
    <div class="header">
      <h1 class="section-title">{{ tournamentItem ? tournamentItem.name : '' }} 😝</h1>
      <img class="share-icon" src="../../assets/icons/share-icon.svg"  alt=""/>
    </div>
    <TournamentDetailsCard :tournament="tournamentItem" />
    <div class="header">
      <h2 class="section-title">Leaderboard</h2>
      <img class="share-icon" src="../../assets/icons/share-icon.svg"  alt=""/>
    </div>
    <div class="tables">
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import Leaderboard from '../../components/tournament-leaders/Leaderboard';

import TopThree from '../../components/tournament-leaders/TopThree';
import TournamentDetailsCard from '../../components/tournaments/TournamentDetailsCard';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs, LeaderboardApiWs } from '@ziqni-tech/member-api-client';
export default {
  name: 'TournamentDetails',
  components: {
    TournamentDetailsCard,
    TopThree,
    Leaderboard,
    ActionsBlock,
  },
  data() {
    return {
      tournamentItem: null,
      isReady: false
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      try {
        const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance)
        const competitionRequest = CompetitionRequest.constructFromObject(      {
          competitionFilter: {
            productIds: [],
            tags: [],
            startDate:null,
            endDate: null,
            ids: [this.$route.params.id],
        }
        }, null)
        await competitionsApiWsClient.getCompetitions(competitionRequest, (res) => {
          this.tournamentItem = res.data[0];
          this.isReady = true;
        })

        const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);
        const leaderboardSubscriptionRequest = {
          action: 'Subscribe',
          entityId: 'n38yUoQBSPM0WYwFnk1B',
          leaderboardFilter: {
            // ranksAboveToInclude: 1,
            // ranksBelowToInclude: 20,
            // topRanksToInclude: 20
          }
        };
        await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (data) => {
          console.log('LEADERBOARD', data);
        });
      } catch (error) {
        console.log('get competition error', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-container {
  .tournament_card {
    max-width: 1030px;
    height: 310px;
  }

  .banner {
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: start;
    background: none;
    border: none;

    .share-icon {
      height: 30px;
      width: 30px;
      margin-left: 18px;
    }
  }

  .tables {
    display: flex;
  }
}
</style>