<template>
  <div class="award" @click="goToAwardDetails">
    <div class="award__icon">
      <img :src="awardIcon" alt="">
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
import { computed, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import defaultAwardIcon from '@/assets/icons/awards/bottle.svg';
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

const awardIcon = computed(() => {
  return props.award.rewardIconLink
      ? props.award.rewardIconLink
      : defaultAwardIcon
})

const icon = ref(null);
const rewardIcon = ref(diamondIcon)
const isLoading = ref(false);


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
  cursor: pointer;

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
    font-family: $semi-bold;
    font-size: 16px;
    color: $text-color-white;
    margin: 5px 0;
  }

  &__type {
    max-width: 170px;
    font-family: $semi-bold;
    font-size: 16px;
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
    font-family: $semi-bold;

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
    font-size: 24px;
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
    font-size: 16px;
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
      font-size: 16px;
      margin-bottom: 10px;
    }

    .claim-button {
      width: 100%;
      border: 1px solid $purple;
      background: $btn-gradient-color;
      color: $text-color-white;
      padding: 6px;
      font-size: 16px;
    }
  }
}
</style>