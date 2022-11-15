<template>
  <router-link to="/tournaments/details" class="link-to-details">
  <CCard class="tournament-card" :class="setCardBackground()">
    <CCardBody class="tournament-card-body">
      <div class="completed-block">
        <CCardImage class="completed-icon" :src="isFeatured ? $options.featuredCompletedIcon : $options.completedIcon" />
        <CCardText class="completed-text" :class="isFeatured ? 'featured-card-title-color' : 'card-title-color'">
          {{ setCardText() }}
        </CCardText>
      </div>

      <div class="card-icon-wrapper">
        <CCardImage
          :class="{
            'tournament-icon': isTournament,
            'featured-mission-icon': isMission && isFeatured,
            'current-mission-icon': isMission && !isFeatured
          }"
          :src="setIcon()"
        />
      </div>

      <CCardTitle class="c-card-title" :class="isFeatured ? 'featured-card-title-color' : 'card-title-color'">
        {{ card.title }}
      </CCardTitle>

      <div class="tournament-info">
        <div class="left-block">
          <CCardImage
            class="info-icon"
            :src="isFeatured ? $options.featuredCompletedRectangularIcon : $options.completedRectangularIcon"
          />
          <CCardText class="info-block-text" :class="isFeatured ? 'featured-card-text-color' : 'card-text-color'">
            {{ card.someCount }}K
          </CCardText>
          <CCardImage class="info-icon" :src="isFeatured ? $options.featuredCompletedPlusIcon : $options.completedPlusIcon" />
          <CCardImage class="info-icon" :src="isFeatured ? $options.featuredCompletedEnergyIcon : $options.completedEnergyIcon" />
        </div>
        <div class="right-block" :class="isFeatured ? 'featured-card-text-color' : 'card-text-color'">
          ${{ card.pricePerHour }}/h
        </div>
      </div>
    </CCardBody>
  </CCard>
  </router-link>
</template>

<script>
import { CCard, CCardBody, CCardImage, CCardText, CCardTitle } from '@coreui/vue';
import completedIcon from '../assets/icons/completed-card/completed-cycle.svg';
import featuredCompletedIcon from '../assets/icons/completed-card/featured-completed-cycle.svg';
import completedRectangularIcon from '../assets/icons/completed-card/completed-rectangular.svg';
import featuredCompletedRectangularIcon from '../assets/icons/completed-card/featured-completed-rectangular.svg';
import completedPlusIcon from '../assets/icons/completed-card/completed-plus.svg';
import featuredCompletedPlusIcon from '../assets/icons/completed-card/featured-completed-plus.svg';
import completedEnergyIcon from '../assets/icons/completed-card/completed-energy.svg';
import featuredCompletedEnergyIcon from '../assets/icons/completed-card/featured-completed-energy.svg';

import kingTournamentIcon from '../assets/icons/king-tournament.svg';
import starTournamentIcon from '../assets/icons/star-tournament.svg';
import winTournamentIcon from '../assets/icons/win-tournament.svg';

import missionRocketIcon from '../assets/icons/mission-card/mission-rocket.svg';
import featuredMissionRocketIcon from '../assets/icons/mission-card/featured-mission-rocket.svg';

export default {
  name: 'TournamentCard',
  completedIcon,
  featuredCompletedIcon,
  completedRectangularIcon,
  featuredCompletedRectangularIcon,
  completedPlusIcon,
  featuredCompletedPlusIcon,
  completedEnergyIcon,
  featuredCompletedEnergyIcon,
  missionRocketIcon,
  featuredMissionRocketIcon,
  kingTournamentIcon,
  starTournamentIcon,
  winTournamentIcon,
  components: {
    CCard,
    CCardBody,
    CCardImage,
    CCardText,
    CCardTitle
  },
  props: {
    card: Object,
    belongs: String
  },
  data: function() {
    return {
      isFeatured: false,
      isMission: false,
      isTournament: false
    }
  },
  created() {
    this.isMission = this.card.title.split(' ')[1].toLowerCase() === 'mission';
    this.isTournament = this.card.title.split(' ')[1].toLowerCase() === 'tournament';
  },
  methods: {
    setCardBackground() {
      switch (this.belongs) {
        case 'featured tournaments': {
          this.isFeatured = true;
          return 'featured-tournament';
        }
        case 'featured missions': {
          this.isFeatured = true;
          return 'featured-mission';
        }
      }
    },
    setCardText() {
      switch (this.belongs) {
        case 'featured tournaments':
          return 'featured tournaments';
        case 'featured missions':
          return 'mission';
        default:
          return `${this.card.percentComplete}% Completed`
      }
    },
    setIcon() {
      if (this.isTournament) {
        switch (this.card.title) {
          case 'King Tournament':
            return kingTournamentIcon;
          case 'Star Tournament':
            return starTournamentIcon;
          case 'Win Tournament':
            return winTournamentIcon;
        }
      }

      if (this.isMission) {
        if (this.isFeatured) {
          return featuredMissionRocketIcon;
        } else {
          return missionRocketIcon;
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.link-to-details {
  text-decoration: none;
}
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
        padding-left: 11px;
        text-transform: capitalize;
      }
    }

    .card-icon-wrapper {
      position: relative;
      width: 100%;
      height: 65%;

      .tournament-icon {
        position: absolute;
        height: 106px;
        margin: 12px 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .featured-mission-icon {
        width: 84px;
        height: 207px;
        position: absolute;
        top: -20%;
        right: 15%;
      }
      .current-mission-icon {
        width: 75px;
        height: 150px;
        position: absolute;
        top: 20%;
        right: 15%;
      }
    }

    .c-card-title {
      text-align: start;
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
    }

    .card-title-color {
      color: #5F6165;
    }

    .featured-card-title-color {
      color: #FFFFFF;
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
      }

      .right-block {
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 18px;
      }

      .card-text-color {
        color: #ABA7D9;
      }

      .featured-card-text-color {
        color: #FFE9E5;
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
.featured-tournament {
  background: $featured-tournament-card-bg-color;
  color: #FFFFFF;
}
.featured-mission {
  background: $featured-mission-card-bg-color;
}

</style>