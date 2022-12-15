<template>
  <router-link :to="{name: 'MissionDetails', params: { id: 1 }}" >
  <div class="mission-card">
    <div class="card-image">
      <img :src="$options.cardImage" alt="">
    </div>
    <div class="mission-data">
      <h2 class="title">World Cup 2022 🏆</h2>
      <div class="prize-fund">
        <span><img :src="$options.peopleIcon" alt=""> 100 </span>
        <span class="fund"><img :src="$options.trophyIcon" alt=""> $1000 </span>
      </div>
      <Countdown
        :date="end"
        :title="'Ends in'"
        :is-row="true"
        :is-small-size="true"
        @onFinish="finish()"
      />
      <CProgress class="mission-progress" :height="13" >
        <CProgressBar :value="25" >25%</CProgressBar>
      </CProgress>
    </div>
  </div>
  </router-link>
</template>

<script>
import { CProgress, CProgressBar } from '@coreui/vue';
import Countdown from '../Countdown';
import cardImage from '../../assets/images/world_cup.png'
import peopleIcon from '../../assets/icons/People.png';
import trophyIcon from '../../assets/icons/Trophy.png';
export default {
  name: 'MissionCard',
  cardImage,
  peopleIcon,
  trophyIcon,
  components: {
    CProgress,
    CProgressBar,
    Countdown
  },
  data () {
    return {
      end: new Date('2023-01-01T00:00:00')
    };
  },
  methods: {
    finish() {
      console.log('finish');
    }
  }
};
</script>

<style lang="scss">

</style>