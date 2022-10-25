<template>
  <CCard class="tournament-card">
    <CCardBody class="tournament-card-body">
      <div class="completed-block">
        <CCardImage class="completed-icon" :src="$options.completedIcon" />
        <CCardText class="completed-text">{{ card.percentComplete}}% Completed</CCardText>
      </div>
      <CCardImage class="card-icon" :src="card.icon" />
      <CCardTitle class="c-card-title">{{ card.title }}</CCardTitle>
      <div class="tournament-info">
        <div class="left-block">
          <CCardImage class="info-icon" :src="$options.completedRectangularIcon" />
          <CCardText class="info-block-text">{{ card.someCount }}K</CCardText>
          <CCardImage class="info-icon" :src="$options.completedPlusIcon" />
          <CCardImage class="info-icon" :src="$options.completedEnergyIcon" />
        </div>
        <div class="right-block">${{ card.pricePerHour }}/h</div>
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { CCard, CCardBody, CCardImage, CCardText, CCardTitle } from '@coreui/vue';
import completedIcon from '../assets/icons/completed-card/completed-cycle.svg';
import completedRectangularIcon from '../assets/icons/completed-card/completed-rectangular.svg';
import completedPlusIcon from '../assets/icons/completed-card/completed-plus.svg';
import completedEnergyIcon from '../assets/icons/completed-card/completed-energy.svg';

export default {
  name: 'TournamentCard',
  completedIcon,
  completedRectangularIcon,
  completedPlusIcon,
  completedEnergyIcon,
  components: {
    CCard,
    CCardBody,
    CCardImage,
    CCardText,
    CCardTitle
  },
  props: {
    card: Object
  },
  methods: {
    setCardBackground() {

    }
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.tournament-card {
  width: 327px;
  height: 243px;
  border-radius: 14px;
  overflow: hidden;
  background: $bg-primary-white;
  border: none;

  .tournament-card-body {
    padding: 21px 31px;

    .completed-block {
      display: flex;
      align-items: center;

      .completed-icon {
        width: 21px;
        height: 21px;
      }
      .completed-text {
        font-family: 'Montserrat';
        font-style: normal;
        font-weight: 700;
        font-size: 16px;
        line-height: 20px;
        color: #242731;
        padding-left: 11px;
      }
    }

    .card-icon {
      height: 106px;
      margin: 12px 0;
    }

    .c-card-title {
      text-align: start;
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      color: #5F6165;
    }

    .tournament-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 18px;
      padding-top: 10px;

      .left-block {
        display: flex;
        width: 50%;
        height: inherit;
        justify-content: space-between;

        .info-icon {
          height: 18px;
          padding: 0;
        }
      }

      .info-block-text {
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: #ABA7D9;
      }

      .right-block {
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
        color: #ABA7D9;
      }
    }
  }
}
.king-tournament {
  background: $king-tournament-card-bg-color
}
.star-tournament {
  background: $star-tournament-card-bg-color;
}
.win-tournament {
  background: $win-tournament-card-bg-color;
}
</style>