<template>
  <div class="t-card" :class="{'light-mode': !isDarkMode}">
    <div class="t-card-image">
      <img :src="cardBannerLink" alt="">
    </div>
    <div class="t-info">
      <div class="tournament-name">{{ cardItem.name }}</div>
      <TournamentDataRow
          :icon="expiresInIcon"
          :label="'Ends'"
          :value="cardItem.scheduledEndDate"
          :is-date="true"
          :is-dark-mode="isDarkMode"
      />
      <TournamentDataRow
          :icon="prizeIcon"
          :label="'prize'"
          :value="cardItem.rewardValue"
          :is-dark-mode="isDarkMode"
      />
      <div class="see-more-btn-wrapper" >
        <button class="see-more-btn" @click="goToTournamentsDetailsPage">See more</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TournamentDataRow from './TournamentDataRow';
import prizeIcon from '@/assets/icons/tournament/prize.png';
import expiresInIcon from '@/assets/icons/tournament/expires-in.png';
import { computed } from 'vue';

const props = defineProps({
  card: Object,
  isDarkMode: Boolean
});

const cardItem = props.card;

const router = useRouter();

const cardBannerLink = computed(() => {
  if (cardItem.bannerLink) {
    return cardItem.bannerLink
  } else if (!cardItem.bannerLink && cardItem.bannerLowResolutionLink) {
    return cardItem.bannerLowResolutionLink
  } else if (!cardItem.bannerLink && !cardItem.bannerLowResolutionLink && cardItem.bannerHighResolutionLink) {
    return cardItem.bannerHighResolutionLink
  } else {
    return cardItem.image
  }
});

const goToTournamentsDetailsPage = () => {
  if (cardItem.contestsCount > 1 || !cardItem.singleContestId.length) {
    router.push({
      name: 'TournamentsBracket',
      params: {
        id: cardItem.id,
      }
    });
  } else {
    router.push({
      name: 'TournamentDetails',
      params: {
        id: cardItem.id,
        contestId: cardItem.singleContestId
      }
    });
  }
};

</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.t-card {

  .t-card-image > img {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    width: 100%;
    height: 170px;
    object-fit: cover;
  }

  .t-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px 13px;
    background-color: $card-bg-DM;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    .tournament-name {
      font-size: 14px;
      font-family: $bold;
      color: $white-color-DM;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 24px;
      max-width: 260px;
    }

    .t-data {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
    }


    .see-more-btn-wrapper {
      width: 100%;
      margin-top: auto;

      .see-more-btn {
        width: 100%;
        margin-top: 18px;

        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 57px;

        background: $btn-primary-bg-color-LM;
        border-radius: $border-radius;
        border: 1px solid $btn-border-color-LM;

        font-size: 14px;
        font-family: $bold;
        color: $white-color-DM;
      }
    }
  }

  &.light-mode {

    .t-info {
      background-color: $card-bg-LM;
      .tournament-name {
        font-size: 14px;
        color: $card-title-color-LM;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 24px;
      }


      .see-more-btn-wrapper {
        width: 100%;
        margin-top: auto;

        .see-more-btn {
          background: $btn-primary-bg-color-LM;
          border-radius: $border-radius;
          border: 1px solid $btn-border-color-LM;

          font-size: 14px;
          color: $text-color-white;
        }
      }
    }
  }
}
@media screen and (max-width: 1430px) {
  .t-card {
    .t-info {
      .tournament-name {
        max-width: 200px;
      }
    }
  }
}
@media screen and (max-width: $tableWidth) {
  .t-card {
    .t-card-image > img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .t-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 8px 8px 13px;

      .tournament-name {
        font-size: 16px;
        color: $text-color-white;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 24px;
      }

      .t-data {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      .see-more-btn-wrapper {
        .see-more-btn {
          margin-top: 0;

          display: flex;
          justify-content: center;
          align-items: center;
          padding: 5px;

          font-size: 12px;
          color: $text-color-white;
        }
      }

    }
  }
}
@media screen and (max-width: 430px) {
  .t-card {
    .t-info {
      .tournament-name {
        max-width: 160px;
      }
    }
  }
}
@media screen and (max-width: 380px) {
  .t-card {
    .t-info {
      .tournament-name {
        max-width: 150px;
      }
    }
  }
}
@media screen and (max-width: 360px) {
  .t-card {
    .t-info {
      .tournament-name {
        max-width: 140px;
      }
    }
  }
}
</style>