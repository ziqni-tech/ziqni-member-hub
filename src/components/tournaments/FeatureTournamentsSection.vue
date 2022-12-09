<template>
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">Feature Tournaments</h2>
      <ActionsBlock/>
    </div>
    <div class="tournament-cards" v-if="competitions">
      <div v-for="c in competitions">
        <TournamentCard class="tournament-card" :key="c.id" :card="c"/>
      </div>
    </div>
    <NotFoundItems v-else :title="'Feature Tournaments'" />
  </div>
</template>

<script>
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';
import TournamentCard from '../../components/tournaments/TournamentCard';
import { ApiClientStomp, CompetitionRequest, CompetitionsApiWs } from '@ziqni-tech/member-api-client';
import NotFoundItems from '../NotFoundItems';

export default {
  name: 'FeatureTournamentsSection',
  components: {
    NotFoundItems,
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
              lessThan: 35
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
.tournament-cards, .missions-cards {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;

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
</style>