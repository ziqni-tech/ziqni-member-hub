<template>
  <div class="header">
    <h1 class="section-title">{{ tournamentItem ? tournamentItem.name : '' }} 😝</h1>
    <img class="share-icon" src="../../assets/icons/share-icon.svg" alt=""/>
  </div>
  <TournamentDetailsCard :tournament="tournamentItem"/>
  <div class="header" v-if="leaderboard">
    <h2 class="section-title">Leaderboard</h2>
    <img class="share-icon" src="../../assets/icons/share-icon.svg" alt=""/>
  </div>
  <div class="tables" v-if="leaderboard">
    <Leaderboard :leaderboard="leaderboard"/>
  </div>
  <NotFoundItems v-else :title="'available competition'" />
</template>

<script>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import Leaderboard from '../../components/tournament-leaders/Leaderboard';
import TopThree from '../../components/tournament-leaders/TopThree';
import TournamentDetailsCard from '../../components/tournaments/TournamentDetailsCard';
import {
  ApiClientStomp,
  CompetitionRequest,
  CompetitionsApiWs,
  ContestRequest,
  ContestsApiWs,
  LeaderboardApiWs
} from '@ziqni-tech/member-api-client';
import { useGetRewards } from '../../hooks/useGetRewards';
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useGetContest } from '../../hooks/useGetContest';
import { useGetLeaderboard } from '../../hooks/useGetLeaderboard';
import NotFoundItems from '../../components/NotFoundItems';

export default {
  name: 'TournamentDetails',
  components: {
    NotFoundItems,
    TournamentDetailsCard,
    TopThree,
    Leaderboard,
    ActionsBlock,
  },
  data() {
    return {
      tournamentItem: null,
      leaderboard: null,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      try {
        const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
        const competitionRequest = CompetitionRequest.constructFromObject({
          competitionFilter: {
            productIds: [],
            tags: [],
            startDate: null,
            endDate: null,
            statusCode: {
              moreThan: 5,
              lessThan: 100
            },
            ids: [this.$route.params.id],
          }
        }, null);
        await competitionsApiWsClient.getCompetitions(competitionRequest, async ({ data }) => {
          this.tournamentItem = await data[0];
          console.warn('COMPETITION', data[0]);
        });

        const contestApiWsClient = new ContestsApiWs(ApiClientStomp.instance);
        const contestRequest = ContestRequest.constructFromObject({
          contestFilter: {
            productIds: [],
            tags: [],
            startDate: null,
            endDate: null,
            ids: [],
            competitionIds: [this.$route.params.id],
            constraints: [],
            statusCode: {
              moreThan: 10,
              lessThan: 100
            },
          }
        }, null);

        await contestApiWsClient.getContests(contestRequest, async (data) => {
          console.warn('CONTEST', data.data);
          if (!this.tournamentItem) {
            this.tournamentItem = data.data[0];
          }

          const activeContest = data.data.filter(c => c.status === 'Active');

          const contestId = activeContest.length ? activeContest[0].id : data.data[0].id;

          const apiLeaderboardWsClient = new LeaderboardApiWs(ApiClientStomp.instance);
          const leaderboardSubscriptionRequest = {
            action: 'Subscribe',
            entityId: contestId,
            leaderboardFilter: {
              ranksAboveToInclude: 20,
              ranksBelowToInclude: 20,
              topRanksToInclude: 1
            }
          };
          await apiLeaderboardWsClient.subscribeToLeaderboard(leaderboardSubscriptionRequest, (data) => {
            this.leaderboard = data.data?.leaderboardEntries;
            console.warn('CONTEST LEADERBOARD', data);
          });
        });

      } catch (error) {
        console.log('get competition error', error);
      }
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

@media screen and (max-width: 1280px){
  .tournament_card {
    width: 100%;
    //height: 310px;
  }
}

.tournament_card {
  max-width: 1030px;
  height: 310px;
}

.banner {
  width: 100%;
}

.header {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
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
</style>