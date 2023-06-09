<template>
  <div class="t-card">
    <div class="t-card-image">
      <img :src="cardImage" alt="">
    </div>
    <div class="t-info">
      <h3 class="tournament-name">{{ cardItem.name }}</h3>
      <TournamentDataRow
          :icon="expiresInIcon"
          :label="'expires in'"
          :value="cardItem.scheduledEndDate"
          :is-date="true"
      />
      <TournamentDataRow
          :icon="prizeIcon"
          :label="'prize'"
          :value="'5000'"
      />
      <button class="see-more-btn" @click="goToTournamentsDetailsPage">See more</button>
    </div>
  </div>
</template>

<script setup>
import TournamentDataRow from './TournamentDataRow';
import prizeIcon from '@/assets/icons/tournament/prize.png';
import expiresInIcon from '@/assets/icons/tournament/expires-in.png';

const props = defineProps({
  card: Object
});

const cardItem = props.card;
import cardImage from '../../assets/images/tournaments/tournament.png';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToTournamentsDetailsPage = () => {
  router.push({
    name: 'TournamentDetails',
    params: {
      id: cardItem.id,
    }
  });
};

</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.t-card {
  display: grid;
  grid-template-rows: 45% 55%;
  background-color: $light-grey;

  .t-card-image > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .t-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px 13px;

    .tournament-name {
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;

      color: $main-text-color-white;
    }

    .t-data {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, minmax(0, 1fr));
    }


    .see-more-btn {
      width: 100%;
      margin-top: auto;

      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $purple;
      border-radius: $border-radius;
      border: 1px solid $border-dark;

      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $main-text-color-white;
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
        font-weight: 700;
        font-size: 12px;
        line-height: 14px;

        color: $main-text-color-white;
      }

      .t-data {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }


      .see-more-btn {
        width: 100%;
        margin-top: auto;

        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;

        background: $purple;
        border-radius: $border-radius;
        border: 1px solid $border-dark;

        font-weight: 700;
        font-size: 12px;
        line-height: 14px;
        color: $main-text-color-white;
      }
    }
  }
}
</style>