<template>
  <div class="page-container">
    <CImage class="banner" rounded :src="$options.banner" />
    <div class="header">
      <h2 class="title">Leaderboard</h2>
      <img class="share-icon" :src="$options.shareIcon" />
    </div>
    <ActionsBlock />
    <div class="tables">
      <Leaderboard />
      <TopThree />
    </div>
  </div>
</template>

<script>
import { CImage } from '@coreui/vue';
import ActionsBlock from '../components/actions-block/ActionsBlock';
import Leaderboard from '../components/tournament-leaders/Leaderboard';

import banner from '../assets/images/banner.png';
import shareIcon from '../assets/icons/share-icon.svg';
import TopThree from '../components/tournament-leaders/TopThree';
export default {
  name: 'TournamentDetails',
  banner,
  shareIcon,
  components: {
    TopThree,
    Leaderboard,
    ActionsBlock,
    CImage
  }
};
</script>

<style lang="scss">
.page-container {
  padding: 21px 42px;

  .banner {
    width: 100%;
  }

  .header {
    display: flex;
    justify-content: start;
    padding-top: 46px;
    background: #FAFAFE;

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