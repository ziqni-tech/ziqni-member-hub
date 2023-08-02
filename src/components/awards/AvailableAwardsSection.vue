<template>
  <div class="content-wrapper">
    <Loader v-if="isLoading" :title="'Awards are loading'" />
    <div class="awards-cards-grid" v-if="isLoaded">
      <div v-for="award in awards">
        <AwardCard :award="award" @claimAward="claimAward" />
      </div>
    </div>
    <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @pageChange="pageChange"
    />
    <CModal size="sm" alignment="center" :visible="modalShow" @close="closeModal">
      <CModalBody>
        {{ 'Award has been claimed' }}
      </CModalBody>
      <CModalFooter>
        <CButton
            @click="closeModal"
            color="primary"
            class="submitBtn"
        >
          OK
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  ApiClientStomp,
  AwardRequest,
  AwardsApiWs,
  ClaimAwardRequest,
  EntityRequest,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';

import AwardCard from '@/components/awards/AwardCard.vue';
import Pagination from '@/shared/components/Pagination.vue';
import { CButton, CModal, CModalBody, CModalFooter, CSpinner } from "@coreui/vue";

import awardIcon_1 from '@/assets/icons/awards/award_1.svg'
import awardIcon_2 from '@/assets/icons/awards/award_2.svg'
import awardIcon_3 from '@/assets/icons/awards/award_3.svg'
import awardIcon_4 from '@/assets/icons/awards/award_4.svg'
import awardIcon_5 from '@/assets/icons/awards/award_5.svg'
import awardIcon_6 from '@/assets/icons/awards/award_6.svg'
import awardIcon_7 from '@/assets/icons/awards/award_7.svg'
import awardIcon_8 from '@/assets/icons/awards/award_8.svg'
import Loader from '@/components/Loader.vue';
import { useStore } from 'vuex';

const awardsImages = [
  awardIcon_1,
  awardIcon_2,
  awardIcon_3,
  awardIcon_4,
  awardIcon_5,
  awardIcon_6,
  awardIcon_7,
  awardIcon_8,
]

const store = useStore()
const emit = defineEmits(['setIsAvailableAwards']);

const awards = ref([]);
const isLoaded = ref(false);
const currentPage = computed(() => store.getters.getCurrentPage);
const totalRecords = ref(0);
const limit = ref(8);

const skip = computed(() => (currentPage.value - 1) * limit.value);
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));

const isLoading = ref(false);
const modalShow = ref(false);

const getAwardsRequest = async () => {
  try {
    isLoading.value = true;

    const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

    const availableAwardsRequest = AwardRequest.constructFromObject({
      awardFilter: {
        statusCode: {
          moreThan: 14,
          lessThan: 16
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

    awardsApiWsClient.getAwards(availableAwardsRequest, async (res) => {
      if (res.data && !res.data.length) {
        emit('setIsAvailableAwards');
        await store.dispatch('setCurrentTab', 'claimed')
      }

      // awards.value = res.data;

      awards.value = res.data.map((award, index) => {
        const image = awardsImages[index % awardsImages.length]
        return {
          ...award,
          rewardIconLink: image,
          imageIdx: index % awardsImages.length
        }
      });

      totalRecords.value = res.meta.totalRecordsFound;

      const rewardIds = res.data.map(item => item.rewardId);
      await getEntityRewards(rewardIds);

      isLoading.value = false;
      isLoaded.value = true;
    });
  } catch (err) {
    console.log('getAwardsRequest error =>', err)
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
        //   award.rewardIconLink = maxReward.iconLink;
        // }
      }
    }
  });
}
const pageChange = async (pageNumber) => {
  currentPage.value = pageNumber;
  await store.dispatch('setCurrentPage', pageNumber)
  await getAwardsRequest();
};

onMounted(() => {
  getAwardsRequest();
})

const claimAward = async (id) => {
  const awardsApiWsClient = new AwardsApiWs(ApiClientStomp.instance);

  const claimAwardRequest = ClaimAwardRequest.constructFromObject({
    awardIds: [id]
  });

  await awardsApiWsClient.claimAwards(claimAwardRequest, async (res) => {
    if (res.data && res.data.length) {
      isLoading.value = true;

      setTimeout(() => {
        modalShow.value = true;
        isLoading.value = false;
      }, 1500);
    }
  });
};

const closeModal = async () => {
  await getAwardsRequest();
  modalShow.value = false;
}
</script>

<style scoped lang="scss">
@import "@/assets/scss/_variables";

.modal-body {
  padding: 30px 18px 20px;
  color: $text-color-white;
  font-size: 16px;
  font-family: $semi-bold;
}

.modal-footer {
  border: none;
}

.submitBtn {
  font-family: $semi-bold;
  font-size: 16px;
}

.awards-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  grid-gap: 15px;
  margin: 30px 0;
}

@media screen and (max-width: $tableWidth) {
  .awards-cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    width: 100%;
    grid-gap: 8px;

    margin-top: 10px;
  }
}
</style>