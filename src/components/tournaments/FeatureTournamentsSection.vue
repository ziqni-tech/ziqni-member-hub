<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Tournaments</h2>
      <ActionsBlock/>
    </div>
    <div class="tournament-cards">
      <div v-for="c in competitions">
        <TournamentCard class="tournament-card" :key="c.id" :card="c"/>
      </div>
    </div>
  </div>
</template>

<script>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import TournamentCard from '../../components/tournaments/TournamentCard';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';

export default {
  name: 'FeatureTournamentsSection',
  components: {
    ActionsBlock,
    TournamentCard
  },
  data() {
    return {
      competitions: []
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.competitions = this.$store.state.competitions
      if (!this.competitions) {
        this.getTournaments()
      }
    },
    async getTournaments() {
      try {
        const competitionsApiWsClient = new CompetitionsApiWs(ApiClientStomp.instance);
        const activeCompetitionRequest = CompetitionRequest.constructFromObject({
          competitionFilter: {
            statusCode: {
              moreThan: 5,
              lessThan: 150
            },
            sortBy: [{
              queryField: 'created',
              order: 'Desc'
            }],
            limit: 20,
            skip: 0
          }
        }, null);

        await competitionsApiWsClient.getCompetitions(activeCompetitionRequest, (res) => {
          this.competitions = res.data;
          this.$store.dispatch('setCurrentCompetitionsAction', res.data);
        });
      } catch (error) {
        console.log('activeCompetitionRequest', error);
      }
    }
  },
  watch: {
    competitions(val) {
      if (val) {
        this.competitions = val;
      }
    }
  }
};
</script>

<style lang="scss">
.section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .section-header {
    width: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 50px 45px 30px 0;
  }

  .tournament-cards, .missions-cards {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    overflow: hidden;
    overflow-x: scroll;

    .tournament-card {
      margin-right: 30px;
    }

    &::-webkit-scrollbar {
      height: 7px;
      width: 7px;
      background-color: #f0f0f0;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: #8a8a8a;
    }
  }
}
</style>