<template>
  <div class="award-details-card">
    <div class="title">
      {{ award.name }}
    </div>
    <div class="icon">
      <img :src="awardIcon" alt="">
    </div>
    <div class="description">
      <span class="description-title">Description</span>
      <span class="description-value">
        {{ award.description ? award.description : testDescription }}
      </span>
    </div>
    <div class="bottom-section">
      <div class="prize-btn">
        <span v-if="award.rewardType.uomSymbol">{{ award.rewardType.uomSymbol }}</span>
        <img v-else src="@/assets/icons/achievements/diamond.png" alt="">
        {{ award.rewardValue }}
      </div>
      <button
          v-if="award.status !== 'Claimed'"
          class="action-btn"
          @click="handleButtonClick"
          :disabled="isLoading"
          :class="{ 'disabled-btn': isLoading }"
      >
        <CSpinner v-if="isLoading" grow size="sm"/>
        <span v-else>Claim</span>
      </button>
      <button
          v-else
          class="action-btn disabled-btn"
          :disabled="true"
      >
        <span>Claimed</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { ApiClientStomp, FilesApiWs, RewardsApiWs } from '@ziqni-tech/member-api-client';
import { CSpinner } from '@coreui/vue';
import defaultAwardIcon from '@/assets/icons/awards/book.png';

const props = defineProps({
  award: Object
});

const emit = defineEmits(['claimAward']);

const award = toRef(props, 'award');

const testDescription = ref('Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.');

const awardIcon = ref(null);
const isLoading = ref(false);

onMounted(() => {
  getAwardIcon();
});

watch(award, (newVal) => {
  isLoading.value = false;
});

const getAwardIcon = async () => {
  const rewardsApiWsClient = new RewardsApiWs(ApiClientStomp.instance);
  const rewardRequest = {
    languageKey: '',
    entityFilter: [{
      entityType: 'Reward',
      entityIds: [award.rewardId]
    }],
    currencyKey: '',
    skip: 0,
    limit: 1
  };
  await rewardsApiWsClient.getRewards(rewardRequest, (res) => {
    if (res.data && res.data.length && res.data[0].icon) {
      const fileApiWsClient = new FilesApiWs(ApiClientStomp.instance);

      const fileRequest = {
        ids: [res.data[0].icon],
        limit: 1,
        skip: 0
      };

      fileApiWsClient.getFiles(fileRequest, (res) => {
        awardIcon.value = res.data[0].uri;
      });
    } else {
      awardIcon.value = defaultAwardIcon;
    }
  });
};

const claimAward = () => {
  emit('claimAward');
};

const handleButtonClick = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    claimAward();
  } catch (e) {
    console.log('click btn error', e);
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables';

.award-details-card {
  max-width: 840px;
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;


  .title {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $text-color-white;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 30px;
  }

  .icon {
    width: 100px;
    height: 100px;
    padding-top: 20px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .description {
    display: flex;
    flex-direction: column;

    .description-title {
      text-align: start;
      width: 100%;
      font-weight: 700;
      font-size: 14px;
      line-height: 17px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .description-value {
      text-align: start;
      width: 100%;
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      color: $text-color-white;
      padding-top: 14px;
    }
  }

  .bottom-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 30px;

    &.centered {
      justify-content: center;
    }

    .disabled-btn {
      background: $btn-grey;
      border: 1px solid $btn-grey;
    }

    .action-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 150px;
      padding: 10px;

      background: $purple-gradient;
      border-radius: 10px;
      border: 1px solid $purple;
      color: $text-color-white;
    }

    .disabled-btn {
      background: $btn-grey;
      border: 1px solid $btn-grey;
    }

    .prize-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 57px;

      background: $dark-grey;
      border-radius: 10px;
      border: 1px solid $dark-grey;
      color: $text-color-white;

      > img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }
  }

}
</style>