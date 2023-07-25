<template>
  <div class="award" @click="goToAwardDetails" :class="{'light-mode': !isDarkMode}">
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
      Claim
    </button>
  </div>
</template>

<script setup>

import { useCountdown } from '@/hooks/useCountdown';
import { computed, ref, toRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import defaultAwardIcon from '@/assets/icons/awards/bottle.svg';
import diamondIcon from '@/assets/icons/achievements/diamond.png';
import { useStore } from "vuex";

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

const store = useStore();
const isDarkMode = computed(() => store.getters.getTheme);


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
@import '@/assets/scss/_variables';

.award {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 34px;
  background-color: $card-bg-DM;
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
    font-family: $bold;
    font-size: 14px;
    color: $white-color-DM;
    margin: 5px 0;
  }

  &__type {
    max-width: 170px;
    font-family: $mainFont;
    font-size: 14px;
    color: $description-color-DM;
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
    color: $white-color-DM;
    background-color: $prize-btn-bg-DM;
    cursor: default;
    border: none;
    padding: 5px;
    font-family: $medium;
    font-size: 24px;
    margin-bottom: 10px;

    > img {
      width: 16px;
      height: 16px;
    }
  }

  .claim-button {
    border: 1px solid $btn-border-color-LM;
    background: $btn-primary-bg-color-LM;
    color: $text-color-white;
    padding: 10px 57px;
    font-size: 14px;
    font-family: $bold;
    text-transform: capitalize;
  }

  &.light-mode {
    background-color: $card-bg-LM;
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

    .award__name {
      color: $section-title-color-LM;
    }

    .award__type {
      max-width: 170px;
      font-family: $mainFont;
      font-size: 14px;
      color: $card-title-color-LM;
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
      color: $card-title-color-LM;
      background-color: $btn-prize-bg-color-LM;
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
      border: 1px solid $btn-primary-bg-color-LM;
      background: $btn-primary-bg-color-LM;
      color: $text-color-white;
      padding: 10px 57px;
      font-size: 16px;
    }
  }

  &.light-mode {
    &__name {
      color: $section-title-color-LM;
    }

    &__type {

      color: $card-title-color-LM;
    }

    .prize {
      color: $card-title-color-LM;
      background-color: $btn-prize-bg-color-LM;
    }
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
      font-family: $bold;
      font-size: 12px;
      line-height: 14px;
      color: $white-color-DM;
      margin: 5px 0;
    }

    &__type {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: $mainFont;
      font-size: 12px;
      line-height: 14px;
      color: $description-color-DM;
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
      color: $white-color-DM;
      background-color: $prize-btn-bg-DM;
      cursor: default;
      border: none;
      padding: 5px;
      font-family: $medium;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .claim-button {
      width: 100%;
      border: 1px solid $btn-border-color-LM;
      background: $btn-primary-bg-color-LM;
      color: $white-color-DM;
      padding: 6px;
      font-size: 14px;
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
      .claim-button {
        width: 100%;
        border: 1px solid $btn-border-color-LM;
        background: $btn-primary-bg-color-LM;
        color: $white-color-DM;
        padding: 6px;
        font-size: 14px;
      }
    }
  }
}
@media screen and (max-width: 420px) {
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
</style>