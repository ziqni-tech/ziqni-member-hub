<template>
  <CContainer class="tournaments-container">
    <div class="title-block">{{ setTitle() }}</div>
    <ActionsBlock />
    <div class="tournaments-block">
      <div v-for="card of cards">
        <TournamentCard :card="card" :belongs="setTitle()" />
      </div>
    </div>
  </CContainer>
</template>

<script>
import { CContainer, CButton } from '@coreui/vue';
import TournamentCard from './TournamentCard_v2';
import ActionsBlock from '../../shared/components/actions-block/ActionsBlock';

export default {
  name: 'TournamentsContainer',
  components: {
    ActionsBlock,
    CContainer,
    CButton,
    TournamentCard
  },
  props: {
    isFeaturedTournaments: {
      type: Boolean,
      default: false
    },
    isCurrentTournaments: {
      type: Boolean,
      default: false
    },
    isFeaturedMissions: {
      type: Boolean,
      default: false
    },
    isCurrentMissions: {
      type: Boolean,
      default: false
    },
    cards: Array,
    cardIcons: Object
  },
  created() {
    console.log('props', this.$props);
  },
  methods: {
    setTitle() {
      if (this.$props.isFeaturedTournaments) return 'featured tournaments'
      if (this.$props.isCurrentTournaments) return 'current tournaments'
      if (this.$props.isFeaturedMissions) return 'featured missions'
      if (this.$props.isCurrentMissions) return 'current missions'
    }
  }
};
</script>

<style lang="scss">
.tournaments-container {
  padding: 0 0 36px;

  .title-block {
    text-align: start;
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 27px;
    color: #737478;
    text-transform: capitalize;
    padding: 0 5px;
  }

  .tournaments-block {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>