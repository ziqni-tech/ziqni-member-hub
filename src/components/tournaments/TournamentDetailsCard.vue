<template>
  <div class="tournament-details-card">
    <div class="card-banner">
      <img :src="banner" alt="">
      <div class="status">
        <Status v-if="tournament && tournament.status" :status="tournament.status" />
      </div>
    </div>
    <div class="tournament-data-wrapper">
      <div class="tournament-data">
        <div class="main-data">
          <span class="main-data__title">{{ tournament?.name }} 😝</span>
          <span class="main-data__rate">RTP: 84% 💎 Rate: 4.9 ✨</span>
        </div>
        <div class="prize">
          <div class="prize_data">
            <span class="prize_data__title">1st Prize</span>
            <span class="prize_data__price">$ 1,500</span>
          </div>
          <div class="prize_img">
            <img :src="cupImg" alt="">
          </div>
        </div>
      </div>
      <Countdown
        v-if="tournament && tournament.scheduledEndDate"
        :date="tournament.scheduledEndDate"
        :title="'Ends in'"
        :is-row="!isMobile"
        :is-column="isMobile"
        :is-detail-card="!isMobile"
        :is-medium-size="isMobile"
        @onFinish="finish()"
        class="countdown"
      />
    </div>

  </div>
</template>

<script setup>
import banner from '../../assets/images/CandyStars-Banner.png';
import cupImg from '../../assets/images/mini_cup.png';
import Status from '../../shared/components/Status';
import Countdown from '../Countdown';
import { useMedia } from '../../hooks/useMedia';

const props = defineProps({ tournament: Object });
const end = new Date('2023-01-01T00:00:00');
const isMobile = useMedia('(max-width: 480px)');
console.warn('DETAIL', props);
const finish = () => {
  console.log('finish');
}
</script>

<style lang="scss">
@import '../../assets/scss/utils/vars';

.tournament-details-card {
  position: relative;
  display: flex;
  max-width: 1030px;
  //max-height: 290px;
  background: #5D53C2;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;
  font-style: normal;

  .card-banner {
    position: relative;
    width: 50%;

    > img {
      width: 100%;
      height: 100%;
    }

    .status {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .tournament-data-wrapper {
    display: flex;
    flex-direction: column;
    width: 50%;
    padding: 20px 0 6px 125px;


    .tournament-data {
      display: flex;
      flex-direction: column;
      width: 50%;

      .main-data {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &__title {
          font-weight: 700;
          font-size: 24px;
          line-height: 36px;
          color: #FFFBFF;
        }

        &__rate {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: #E4E4E4;
        }
      }

      .prize {
        display: flex;
        align-items: center;
        margin: 13px 0 20px;

        .prize_data {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          &__title {
            font-weight: 500;
            font-size: 19px;
            line-height: 28px;
            color: #E4E4E4;
          }

          &__price {
            font-weight: 700;
            font-size: 26px;
            line-height: 40px;
            color: #FFFFFF;
          }
        }

        .prize_img {
          width: 73px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          object-fit: cover;
          padding-left: 20px;

          & > img {
            width: inherit;
            height: inherit;
          }
        }
      }
    }
  }

}
@media screen and (max-width: $desktopWidth) {
  .tournament-details-card {
    display: flex;
    flex-wrap: wrap;

    .card-banner {
      position: relative;
      width: 100%;

      > img {
        width: 100%;
        height: auto;
      }

      .status {
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .tournament-data-wrapper {
      padding: 10px 10px 15px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;

      .tournament-data {
        display: flex;
        width: 50%;

        .main-data {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          &__title {
            font-weight: 700;
            font-size: 18px;
            line-height: 24px;
            color: #FFFBFF;
          }

          &__rate {
            font-weight: 400;
            font-size: 14px;
            line-height: 18px;
            color: #E4E4E4;
          }
        }

        .prize {
          display: flex;
          align-items: center;
          margin: 8px 0 0;

          .prize_data {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            &__title {
              font-weight: 500;
              font-size: 19px;
              line-height: 28px;
              color: #E4E4E4;
            }

            &__price {
              font-weight: 700;
              font-size: 26px;
              line-height: 40px;
              color: #FFFFFF;
            }
          }

          .prize_img {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            object-fit: cover;
            padding-left: 20px;

            & > img {
              width: inherit;
              height: inherit;
            }
          }
        }
      }
      .countdown {
        width: 50%;
        align-items: center;
        padding: 25px 0;
        .space-between {
          //justify-content: space-evenly;
        }
        .title-medium {
          max-width: 100px;
          padding-bottom: 10px;
          margin-right: 65px;
        }
      }
    }
  }
}
</style>