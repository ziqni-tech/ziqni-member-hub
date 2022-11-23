<template>
  <div class="page-container" v-if="isReady">
    <div class="header">
      <h1 class="title">{{ tournamentItem ? tournamentItem.name : '' }} 😝</h1>
      <img class="share-icon" :src="$options.shareIcon" />
    </div>
    <TournamentDetailsCard :tournament="tournamentItem" />
    <div class="header">
      <h2 class="title">Leaderboard</h2>
      <img class="share-icon" :src="$options.shareIcon" />
    </div>
    <div class="tables">
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import { CImage } from '@coreui/vue';
import ActionsBlock from '../shared/components/actions-block/ActionsBlock';
import Leaderboard from '../components/tournament-leaders/Leaderboard';

import shareIcon from '../assets/icons/share-icon.svg';
import TopThree from '../components/tournament-leaders/TopThree';
import TournamentDetailsCard from '../components/tournaments/TournamentDetailsCard';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
export default {
  name: 'TournamentDetails',
  shareIcon,
  components: {
    TournamentDetailsCard,
    TopThree,
    Leaderboard,
    ActionsBlock,
    CImage
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
      } catch (error) {
        console.log('get competition error', error);
      }
    }
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;

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
    padding-top: 46px;
    background: none;
    border: none;

    .title {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      font-size: 22px;
      line-height: 27px;
      color: #737478;
    }

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