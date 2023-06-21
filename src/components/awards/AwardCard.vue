<template>
  <div class="award" @click="goToAwardDetails">
    <div class="award__icon">
      <img :src="defaultAwardIcon" alt="">
    </div>
    <h3 class="award__name">{{ award.name }}</h3>
    <h5 class="award__type">{{ award.rewardType.key }}</h5>
    <div class="award__btn prize">
      <img :src="rewardIcon" alt="">
      {{ award.rewardValue }}
    </div>
    <button
        class="award__btn claim-button"
        v-if="award.status !== 'Claimed'"
        @click.stop="handleButtonClick"
    >
      <CSpinner v-if="isLoading" grow size="sm"/>
      <span v-else>Claim</span>
    </button>
  </div>
</template>

<script setup>

import { useCountdown } from '@/hooks/useCountdown';
import { onMounted, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import {
  ApiClientStomp,
  FilesApiWs,
  RewardsApiWs
} from '@ziqni-tech/member-api-client';
import defaultAwardIcon from '@/assets/icons/awards/book.png';
import { CSpinner } from '@coreui/vue';
import diamondIcon from '@/assets/icons/achievements/diamond.png';

const countdownResult = useCountdown();

const date = ref('');

const props = defineProps({
  award: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['claimAward'])

const router = useRouter()

const award = toRef(props, 'award');

const awardIcon = ref(defaultAwardIcon);
const icon = ref(null);
const rewardIcon = ref(diamondIcon)
const isLoading = ref(false);

watch(icon, (value) => {
  if (value) {
    rewardIcon.value = value;
    awardIcon.value = value;
  }
})

onMounted(() => {
  getAwardIcon()
})

const getAwardIcon = async () => {
  const rewardsApiWsClient = new RewardsApiWs(ApiClientStomp.instance);
  const rewardRequest = {
    languageKey: '',
    entityFilter: [{
      entityType: 'Reward',
      entityIds: [award.value.rewardId]
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
        icon.value = res.data[0].uri;
      });
    }
  });
}

const goToAwardDetails = () => {
  router.push({
    name: 'AwardDetails',
    params: {
      id: award.value.id,
    }
  })
}
const claimAward = async () => {
  emit('claimAward', award.value.id)
};

const handleButtonClick = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  try {
    await claimAward()
  } catch (e) {
    console.log('click btn error', e);
  }
};

watch(award, (value) => {
  if (value) isLoading.value = false;
});

watch(countdownResult, (value) => {
  if (value) {
    const { days, hours, minutes, seconds, expired } = value;
    date.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>
@import '../../assets/scss/_variables';

.award {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 34px;
  background-color: $light-grey;
  border-radius: $border-radius;

  &__icon {
    width: 136px;
    height: 136px;
    padding: 23px;
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

    & > img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: $text-color-white;
    margin: 5px 0;
  }

  &__type {
    max-width: 170px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;

    > img {
      margin-right: 5px;
    }
  }

  .prize {
    color: $text-color-white;
    background-color: $dark-grey;
    cursor: default;
    border: none;
    padding: 5px;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    margin-bottom: 10px;

    > img {
      width: 16px;
      height: 16px;
    }
  }

  .claim-button {
    border: 1px solid $purple;
    background: $btn-gradient-color;
    color: $text-color-white;
    padding: 10px 57px;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
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
      width: 136px;
      height: 136px;
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
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      color: $text-color-white;
      margin: 5px 0;
    }

    &__type {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: $body-text-color;
      margin-bottom: 10px;
    }

    &__btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $border-radius;

      > img {
        margin-right: 5px;
      }
    }

    .prize {
      color: $text-color-white;
      background-color: $dark-grey;
      cursor: default;
      border: none;
      padding: 5px;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      margin-bottom: 10px;
    }

    .claim-button {
      width: 100%;
      border: 1px solid $purple;
      background: $btn-gradient-color;
      color: $text-color-white;
      padding: 6px;
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
    }
  }
}
</style>