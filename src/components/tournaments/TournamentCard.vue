<template>
  <div class="tournament-card">
    <div class="status">
      <Status :status="cardItem.status" />
    </div>
    <div class="left">
      <div class="logo-casino">
        <img src="../../assets/images/candy.png" alt="">
      </div>
      <Countdown
        :date="cardItem.scheduledEndDate"
        :title="'Ends in'"
        :is-row="true"
        :is-small-size="true"
        @onFinish="finish()"
      />
    </div>
    <div class="tournament-data">
      <div class="main-data">
        <span class="main-data__title">{{ cardItem.name }}</span>
        <div class="main-data__rate">
          <span>RTP: 84% 💎</span>
          <span>Rate: 4.9 ✨</span>
        </div>
      </div>
      <div class="prize">
        <div class="prize_data">
          <span class="prize_data__title">1st Prize</span>
          <span class="prize_data__price">$ 1,500</span>
        </div>
        <div class="prize_img">
          <img src="../../assets/images/mini_cup.png" alt="">
        </div>
      </div>
      <router-link :to="{name: 'TournamentDetails', params: {
          id: cardItem.id,
        }}">
        <CButton class="m-btn">
          <span class="b-btn__text">See More</span>
          <img src="../../assets/icons/button_icon.svg" alt="">
        </CButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import { CButton } from '@coreui/vue';
import Countdown from '../Countdown';
import Status from '../../shared/components/Status';

export default {
  name: 'TournamentCard',
  components: {
    Status,
    Countdown,
    CButton
  },
  props: {
    card: Object
  },
  data () {
    return {
      end: new Date('2023-01-01T00:00:00'),
      cardItem: null
    };
  },
  created() {
    this.cardItem = this.card;
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