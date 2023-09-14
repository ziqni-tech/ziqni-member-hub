<template>
  <div class="t-card" :class="{'light-mode': !isDarkMode}">
    <div class="t-card-image">
      <img :src="cardItem.image" alt="">
    </div>
    <div class="t-info">
      <div class="tournament-name">{{ cardItem.name }}</div>
      <div class="schedule">
        {{ formatDateRange(cardItem.scheduledStartDate, cardItem.scheduledEndDate) }}
      </div>

      <div class="see-more-btn-wrapper" >

        <div class="prize"><TrophyIcon />
          {{ cardItem.rewardValue}}</div>
        <button class="see-more-btn" @click="goToTournamentsDetailsPage">See more</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TrophyIcon from '@/shared/components/svg-icons/TrophyIcon.vue';

const props = defineProps({
  card: Object,
  isDarkMode: Boolean
});

const cardItem = props.card;

function formatDateRange(startDateStr, endDateStr) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startMonth = months[startDate.getMonth()];
  const endMonth = months[endDate.getMonth()];

  const formattedStartDate = `${startMonth} ${startDate.getDate()}`;
  const formattedEndDate = `${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`;

  return `${formattedStartDate} - ${formattedEndDate}`;
}

const router = useRouter();

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
    height: 100%;
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

    .schedule {
      color: white;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }

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
      display: flex;
      align-items: center;
      justify-content: space-between;

      .prize {
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        color: #41B2A1;
      }

      .see-more-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px ;

        background: $btn-primary-bg-color-LM;
        border-radius: $border-radius;
        border: 1px solid $btn-border-color-LM;
        color: white;

        font-size: 12px;
        font-style: normal;
        font-weight: 600;
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

      .schedule {
        color: #202B38;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
      }


      .see-more-btn-wrapper {
        width: 100%;
        margin-top: auto;

        .see-more-btn {
          background: $btn-primary-bg-color-LM;
          border-radius: $border-radius;
          border: 1px solid $btn-border-color-LM;

          font-size: 12px;
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
      height: 100%;
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