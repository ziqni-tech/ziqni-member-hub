<template>
  <CModal
    alignment="center"
    :visible="modalShow"
    @close="close"
    size="lg"
    class="awards-modal"
    :class="{'light-mode': !isDarkMode}"
    scrollable
  >
    <CModalHeader :class="{'light-mode': !isDarkMode}">
      <CModalTitle :class="{'light-mode': !isDarkMode}">{{ title }}</CModalTitle>
    </CModalHeader>
    <CModalBody :class="{'light-mode': !isDarkMode}">
      <div class="awards-cards-grid">
        <div
          v-for="(award, index) in awards"
          :key="index"
          @click="selectAward(award)"
          class="award"
          :class="{'light-mode': !isDarkMode}"
        >
          <div class="award__icon">
            <img class="award-img" :src="award.rewardIconLink" alt="">
          </div>
          <h3 class="award__name">{{ award.name }}</h3>
          <div class="award__btn prize">
            {{ award.rewardValue }}
          </div>
      </div>
      </div>
    </CModalBody>
    <CModalFooter :class="{'light-mode': !isDarkMode}">
      <div
        v-if="loading"
        disabled
        class="load-more-btn"
      >
        Loading...
      </div>
      <CButton
        v-if="!loading && canLoadMore"
        @click="loadMoreAwards"
        class="load-more-btn"
      >
        Load More
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/vue';

import awardIcon_1 from '@/assets/icons/awards/award_1.svg';
import awardIcon_2 from '@/assets/icons/awards/award_2.svg';
import awardIcon_3 from '@/assets/icons/awards/award_3.svg';
import awardIcon_4 from '@/assets/icons/awards/award_4.svg';
import awardIcon_5 from '@/assets/icons/awards/award_5.svg';
import awardIcon_6 from '@/assets/icons/awards/award_6.svg';
import awardIcon_7 from '@/assets/icons/awards/award_7.svg';
import awardIcon_8 from '@/assets/icons/awards/award_8.svg';
import Loader from '@/components/Loader.vue';
import diamondIcon from '@/assets/icons/achievements/diamond.png';
import { ApiClientStomp, AwardRequest, AwardsApiWs, EntityRequest, RewardsApiWs } from '@ziqni-tech/member-api-client';
import defaultAwardIcon from '@/assets/icons/awards/bottle.svg';

const awardsImages = [
  awardIcon_1,
  awardIcon_2,
  awardIcon_3,
  awardIcon_4,
  awardIcon_5,
  awardIcon_6,
  awardIcon_7,
  awardIcon_8,
];

const defaultRewardIcon = ref(diamondIcon)

const props = defineProps({
  modalShow: Boolean,
  isDarkMode: Boolean,
});

const title = ref('Select an award');

const emit = defineEmits(['closeModal', 'selectAward']);

const awards = ref([]);
const loading = ref(false);
const canLoadMore = ref(true);

const totalRecords = ref(0);
const limit = ref(20);

const skip = ref(0);

const loadInitialAwards = async () => {
  try {
    loading.value = true;
    const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);
// action - spin-win tag - instant-win
    const claimedAwardsRequest = AwardRequest.constructFromObject({
      awardFilter: {
        statusCode: {
          moreThan: 34,
          lessThan: 36
        },
        tags: [],
        ids: [],
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        skip: skip.value,
        limit: limit.value
      },
      currencyKey: ''
    });

    awardsApiWsClient.getAwards(claimedAwardsRequest, async (res) => {
      // awards.value = res.data;
      console.log('awards', res.data);
      awards.value = res.data.map((award, index) => {
        const image = awardsImages[index % awardsImages.length];

        return {
          ...award,
          rewardIconLink: image,
          imageIdx: index % awardsImages.length
        };
      });

      totalRecords.value = res.meta.totalRecordsFound;
      const rewardIds = res.data.map(item => item.rewardId);
      await getEntityRewards(rewardIds);
      loading.value = false;
    });
  } catch (err) {
    console.log('getAwardsRequest error =>', err);
    loading.value = false;
  }
};

const getEntityRewards = async (ids) => {
  const rewardsApiWsClient = await new RewardsApiWs(ApiClientStomp.instance);

  const rewardRequest = EntityRequest.constructFromObject({
    entityFilter: [
      {
        entityType: 'Reward',
        entityIds: ids
      },
    ],
    skip: 0,
    limit: limit.value
  }, null);

  await rewardsApiWsClient.getRewards(rewardRequest, async (res) => {
    for (const award of awards.value) {
      if (res.data.length) {
        let maxReward = null;
        for (const reward of res.data) {
          if (reward.entityId === award.entityId) {
            if (!maxReward || reward.rewardValue > maxReward.rewardValue) {
              maxReward = reward;
            }
          }
        }
        // if (maxReward) {
        //   if (maxReward.iconLink !== 'https://first-space.cdn.ziqni.com/_id/5kBFW4cBEZSDWzgDFZ2O') {
        //     award.rewardIconLink = maxReward.iconLink;
        //   } else {
        //     award.rewardIconLink = 'https://first-space.cdn.ziqni.com/Icons/book.png';
        //   }
        // }
      }
    }
  });
};

const close = () => {
  emit('closeModal');
};

const loadMoreAwards = async () => {
  if (!canLoadMore.value || loading.value) return;

  loading.value = true;
  skip.value += limit.value;

  try {
    const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

    const claimedAwardsRequest = AwardRequest.constructFromObject({
      awardFilter: {
        statusCode: {
          moreThan: 34,
          lessThan: 36
        },
        sortBy: [{
          queryField: 'created',
          order: 'Desc'
        }],
        skip: skip.value,
        limit: limit.value
      },
      currencyKey: ''
    });

    awardsApiWsClient.getAwards(claimedAwardsRequest, async (res) => {
      if (res.data.length > 0) {
        const newAwards = res.data.map((award, index) => {
          const imageIdx = (skip.value + index) % awardsImages.length;
          return {
            ...award,
            rewardIconLink: awardsImages[imageIdx],
            imageIdx
          };
        });

        awards.value = [...awards.value, ...newAwards];

        totalRecords.value = res.meta.totalRecordsFound;
        const rewardIds = res.data.map(item => item.rewardId);
        await getEntityRewards(rewardIds);

        if (awards.value.length >= totalRecords.value) {
          canLoadMore.value = false;
        }
      } else {
        canLoadMore.value = false;
      }

      loading.value = false;
    });
  } catch (err) {
    console.log('loadMoreAwards error =>', err);
    loading.value = false;
  }
};

const selectAward = (award) => {
  console.log('selectAward', award);
  emit('selectAward', award.id);
};

onMounted(() => {
  loadInitialAwards();
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.modal-dialog {
  max-width: 90vw;
  width: 100%;
}

.awards-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;
  margin: 30px 0;

  .award {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 34px;
    background-color: $card-bg-DM;
    border-radius: $border-radius;
    cursor: pointer;

    &__icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;

        background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
        opacity: 0.5;
        filter: blur(37.5px);
      }

      .award-img {
        width: 160%;
        height: 160%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    &__name {
      font-family: $bold;
      font-size: 14px;
      color: $white-color-DM;
      margin: 5px 0;
    }

    .prize {
      color: $white-color-DM;
      background-color: $prize-btn-bg-DM;
      cursor: default;
      border: none;
      padding: 5px;
      font-family: $medium;
      font-size: 20px;
      margin-bottom: 10px;

      > img {
        width: 16px;
        height: 16px;
      }
    }

    &.light-mode {
      background-color: $card-bg-LM;
      border-radius: $border-radius;
      cursor: pointer;

      &__icon {
        width: 136px;
        height: 136px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;

          background: radial-gradient(50% 50% at 50% 50%, #38ACCF 0%, rgba(56, 172, 207, 0) 100%);
          opacity: 0.5;
          filter: blur(37.5px);
        }
      }

      .award__name {
        color: $section-title-color-LM;
      }

      .prize {
        color: $card-title-color-LM;
        background-color: $btn-prize-bg-color-LM;
        cursor: default;
        border: none;
        padding: 5px;
        font-size: 20px;
        margin-bottom: 10px;

        > img {
          width: 16px;
          height: 16px;
        }
      }

    }

    &.light-mode {
      &__name {
        color: $section-title-color-LM;
      }

      .prize {
        color: $card-title-color-LM;
        background-color: $btn-prize-bg-color-LM;
      }
    }

  }

  @media screen and (max-width: $tableWidth) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 8px;
    margin-top: 10px;
  }
}

@media screen and (max-width: $tableWidth) {
  .award {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    background-color: $light-grey;
    border-radius: $border-radius;

    &__icon {
      width: 60px;
      height: 60px;
      border-radius: $border-radius-round;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__name {
      font-family: $bold;
      font-size: 12px;
      line-height: 14px;
      color: $white-color-DM;
      margin: 5px 0;
    }

    .prize {
      color: $white-color-DM;
      background-color: $prize-btn-bg-DM;
      cursor: default;
      border: none;
      padding: 5px;
      font-family: $medium;
      font-size: 16px;
      margin-bottom: 10px;
    }

    &.light-mode {
      .prize {
        color: $card-title-color-LM;
        background-color: $btn-prize-bg-color-LM;
        cursor: default;
        border: none;
        padding: 5px;
        font-family: $medium;
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
}
@media screen and (max-width: 430px) {
  .award {
    max-width: 190px;
  }
}
@media screen and (max-width: 390px) {
  .award {
    max-width: 180px;
  }
}
@media screen and (max-width: 380px) {
  .award {
    max-width: 170px;
  }
}

.award__btn.prize {
  width: 100%;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  display: block;
  border-radius: $border-radius;
}

.load-more-btn {
  margin: 0 auto;
}

.loading-btn {
  background-color: #ccc;
  color: #666;
}
</style>

