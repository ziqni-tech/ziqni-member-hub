<template>
  <div class="award-details-card" :class="{'light-mode': !isDarkMode}">
    <div class="spinner-wrapper-global" v-if="isLoading">
      <Loader class="loader"/>
    </div>
    <button class="info-btn" @click="goToInfo">
      i
    </button>
    <div class="title">
      {{ award.name }}
    </div>
    <div class="icon">
      <img :src="awardIcon" alt="">
    </div>
    <div class="prize">
      <span v-if="award.rewardType.uomSymbol">{{ award.rewardType.uomSymbol }}</span>
      {{ award.rewardValue }}
    </div>
    <div class="description" v-if="isInfo">
      <span class="description-title">Terms and conditions</span>
      <span class="description-value">
        {{ removeHTMLTags(termsAndConditions) }}
      </span>
    </div>
    <div class="description" v-if="!isInfo">
      <span class="description-title">Description</span>
      <span class="description-value">
        {{ removeHTMLTags(description) }}
      </span>
    </div>
    <div class="bottom-section">
      <button
          v-if="!isClaimed"
          class="action-btn"
          @click="handleButtonClick"
          :disabled="isLoading"
          :class="{ 'disabled-btn': isLoading }"
      >
        <span>Claim</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRef } from 'vue';
import defaultAwardIcon from '@/assets/icons/awards/bottle.svg';
import { removeHTMLTags } from '@/utils/removeHTMLTags';
import { useRoute } from 'vue-router';
import Loader from '@/components/Loader.vue';
import { ApiClientStomp } from '@ziqni-tech/member-api-client';

const props = defineProps({
  award: Object,
  isDarkMode: Boolean
});

const route = useRoute();

const emit = defineEmits(['claimAward']);

const award = toRef(props, 'award');
const isClaimed = ref(award.value.status === 'Claimed');

const icon = ref(null);
const awardIcon = computed(() => {
  return props.award.rewardIconLink;
  // ? props.award.rewardIconLink
  // : defaultAwardIcon
});

const isLoading = ref(false);

const description = computed(() => {
  return award.value.description
      ? award.value.description
      : 'No Description provided';
});

const termsAndConditions = computed(() => {
  return award.value.termsAndConditions
      ? award.value.termsAndConditions
      : 'No Terms and conditions provided';
});

const isInfo = ref(false);

const goToInfo = () => {
  isInfo.value = !isInfo.value;
};


const claimAward = () => {
  emit('claimAward');
};

onMounted(() => {
  ApiClientStomp.instance.sendSys('', {}, async (json, headers) => {
    if (json && json.entityType === 'Award') {
      if (json.entityId === award.value.id) {
        isClaimed.value = json.metadata.claimed;
        isLoading.value = false;
      }
    }
  });
});

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

.loader {
  z-index: 15;
}

.award-details-card {
  max-width: 840px;
  background-color: $card-bg-DM;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  position: relative;

  .info-btn {
    width: 30px;
    height: 30px;
    border-radius: $border-radius-sm;
    background: none;
    border: 1px solid $info-item-icon-bg-DM;
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    color: $white-color-DM
  }


  .title {
    font-family: $bold;
    font-size: 20px;
    color: $white-color-DM;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 30px 0 20px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    padding: 20px 0;
    border-radius: 50%;
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
      max-width: 200%;
      max-height: 200%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .prize {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white-color-DM;
    margin-top: 20px;
    font-size: 20px;
    font-family: $bold;

    > img {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }
  }

  .description {
    display: flex;
    flex-direction: column;
    width: 100%;

    .description-title {
      text-align: start;
      width: 100%;
      font-size: 14px;
      font-family: $medium;
      color: $white-color-DM;
      padding-top: 20px;
    }

    .description-value {
      font-family: $mainFont;
      text-align: start;
      width: 100%;
      font-size: 12px;
      color: $white-color-DM;
      padding-top: 14px;
    }
  }

  .bottom-section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 30px;

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
      font-size: 14px;
      font-family: $bold;

      background: $btn-primary-bg-color-LM;
      border-radius: 10px;
      border: 1px solid $btn-border-color-LM;
      color: $white-color-DM;
    }

    .disabled-btn {
      background: $btn-grey;
      border: 1px solid $btn-grey;
    }
  }

  &.light-mode {
    max-width: 840px;
    background-color: $card-bg-LM;
    border-radius: $border-radius;
    padding: 10px 25px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;

    .info-btn {
      width: 30px;
      height: 30px;
      border-radius: $border-radius-sm;
      background: none;
      border: 1px solid $main-border-color-LM;
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: $card-text-color-LM;
    }

    .title {
      color: $section-title-color-LM;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 30px;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 150px;
      padding: 20px 0;
      border-radius: 50%;
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
        max-width: 200%;
        max-height: 200%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .prize {
      color: $section-title-color-LM;

      > img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      width: 100%;

      .description-title {;
        color: $section-title-color-LM;
      }

      .description-value {
        color: $card-title-color-LM;
      }
    }

    .bottom-section {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 30px;

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

        background: $btn-primary-bg-color-LM;
        border-radius: 10px;
        border: 1px solid $btn-border-color-LM;
        color: $btn-primary-color-LM;
      }

      .disabled-btn {
        background: $btn-prize-color-LM;
        border: 1px solid $btn-prize-color-LM;
      }
    }
  }
}

@media screen and (max-width: $tableWidth) {
  .award-details-card {
    font-family: $semi-bold;
    max-width: 840px;
    border-radius: $border-radius;
    padding: 10px 25px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;


    .title {
      font-family: $mainFont;
      font-size: 22px;
      color: $white-color-DM;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-top: 30px;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
      height: 150px;
      padding: 20px 0;
      border-radius: 50%;
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
        max-width: 200%;
        max-height: 200%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .prize {
      display: flex;
      justify-content: center;
      align-items: center;
      color: $white-color-DM;
      margin-top: 20px;
      font-size: 22px;

      > img {
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
    }

    .description {
      display: flex;
      flex-direction: column;
      width: 100%;

      .description-title {
        text-align: start;
        width: 100%;
        font-size: 16px;
        color: $white-color-DM;
        padding-top: 20px;
      }

      .description-value {
        font-family: $mainFont;
        text-align: start;
        width: 100%;
        font-size: 12px;
        color: $white-color-DM;
        padding-top: 14px;
      }
    }

    .bottom-section {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-top: 30px;

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

        border-radius: 10px;
        color: $white-color-DM;
      }

      .disabled-btn {
        background: $btn-grey;
        border: 1px solid $btn-grey;
      }
    }
  }
}
</style>