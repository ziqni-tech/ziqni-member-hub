<template>
  <div class="award-details-card">
    <div class="title">
      {{ award.name }}
    </div>
    <div class="icon">
      <img :src="awardIcon" alt="" >
    </div>
    <div class="prize">
      <span v-if="award.rewardType.uomSymbol">{{ award.rewardType.uomSymbol }}</span>
      {{ award.rewardValue }}
    </div>
    <div class="description">
      <span class="description-title">Description</span>
      <span class="description-value">
        {{ award.description ? award.description : testDescription }}
      </span>
    </div>
    <div class="bottom-section">
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
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRef, watch } from 'vue';
import { CSpinner } from '@coreui/vue';
import defaultAwardIcon from '@/assets/icons/awards/book.png';

const props = defineProps({
  award: Object
});

const emit = defineEmits(['claimAward']);

const award = toRef(props, 'award');

const testDescription = ref('Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.');

const icon = ref(null);
const awardIcon = computed(() => {
  return props.award.rewardIconLink
      ? props.award.rewardIconLink
      : defaultAwardIcon
})

const isLoading = ref(false);

watch(award, (value) => {
  if (value) isLoading.value = false;
});

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
  font-family: $semi-bold;
  max-width: 840px;
  background-color: $light-grey;
  border-radius: $border-radius;
  padding: 10px 25px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;


  .title {
    font-size: 27px;
    color: $text-color-white;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 30px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    padding-top: 20px;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .prize {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-color-white;
    margin-top: 10px;

    > img {
      margin-right: 10px;
      width: 20px;
      height: 20px;
    }
  }

  .description {
    display: flex;
    flex-direction: column;

    .description-title {
      text-align: start;
      width: 100%;
      font-size: 16px;
      color: $text-color-white;
      padding-top: 20px;
    }

    .description-value {
      text-align: start;
      width: 100%;
      font-size: 12px;
      color: $text-color-white;
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

      background: $purple-gradient;
      border-radius: 10px;
      border: 1px solid $purple;
      color: $text-color-white;
    }

    .disabled-btn {
      background: $btn-grey;
      border: 1px solid $btn-grey;
    }
  }

}
</style>