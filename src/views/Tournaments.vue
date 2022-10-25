<template>
  <CContainer>
    <TournamentsContainer :is-featured-tournaments="true" :cards="$options.tournamentCards" />
    <TournamentsContainer :is-current-tournaments="true" :cards="$options.tournamentCards" />
  </CContainer>
</template>

<script>
import { CContainer } from '@coreui/vue';
import TournamentsContainer from '../components/tournaments/TournamentsContainer';
import kingTournamentIcon from '../assets/icons/king-tournament.svg';
import starTournamentIcon from '../assets/icons/star-tournament.svg';
import winTournamentIcon from '../assets/icons/win-tournament.svg';

const tournamentCards = [
  {title: 'King Tournament', icon: kingTournamentIcon, percentComplete: 64, pricePerHour: 32, someCount: 132, bg: 'king-tournament'},
  {title: 'Star Tournament', icon: starTournamentIcon, percentComplete: 54, pricePerHour: 28, someCount: 130, bg: 'star-tournament'},
  {title: 'Win Tournament', icon: winTournamentIcon, percentComplete: 74, pricePerHour: 28, someCount: 130, bg: 'win-tournament'},
]

export default {
  name: 'Tournaments',
  tournamentCards,
  components: {
    CContainer,
    TournamentsContainer
  }
};
</script>

<style scoped>

</style>