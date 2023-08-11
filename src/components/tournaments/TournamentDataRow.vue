<template>
  <div
      class="data-row"
      :class="{'light-mode': !isDarkMode, 'mobile-flex-column': isMobileFlexColumn}"
  >
    <div class="label">
      <div class="icon" v-if="icon">
        <img :src="icon" alt="">
      </div>
      {{ label }}
    </div>
    <div class="value">
      {{ isDate ? date : value }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  icon: String,
  label: String,
  value: String,
  isDate: Boolean,
  isDarkMode: Boolean,
  isSecondsShow: {
    type: Boolean,
    default: true
  },
  isMobileFlexColumn: {
    type: Boolean,
    default: true
  }
});
import { useCountdown } from '@/hooks/useCountdown';

const countdownResult = useCountdown(props.value);
const date = ref('');

watch(countdownResult, (value) => {
  if (value) {
    const { days, hours, minutes, seconds, expired } = value;
    if (props.isSecondsShow) {
      date.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
    } else {
      date.value = `${ days }d ${ hours }h ${ minutes }m`;
    }
  }
});
</script>

<style lang="scss">
@import '@/assets/scss/_variables';

.data-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: $medium;
  font-size: 12px;
  margin-top: 10px;

  .label {
    display: flex;
    align-items: center;
    text-transform: capitalize;
    color: $dark-blue-DM;

    .icon {
      margin-right: 5px;

      > img {
        margin-bottom: 10px;
      }
    }
  }

  .value {
    text-align: right;
    color: $white-color-DM;
    display: block;
    min-height: 5px;
  }

  &.light-mode {
    .label {
      color: $card-text-color-LM;
    }

    .value {
      color: $section-title-color-LM;

    }
  }
}

.mobile-flex-column {
  @media screen and (max-width: $tableWidth) {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media screen and (max-width: $tableWidth) {
  .data-row {
    width: 100%;
    display: flex;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    margin: 5px 0;

    .label {
      display: flex;
      align-items: center;
      text-transform: capitalize;

      .icon {
        margin-right: 5px;
      }
    }

    .value {
      height: 10px;
      text-align: right;
      color: $text-color-white;
      margin-left: 17px;

      &::before {
        content: '\00a0';
        visibility: hidden;
      }
    }
  }
}

@media screen and (max-width: 450px) {
  .data-row {
    width: 100%;
    display: flex;
    font-weight: 500;
    font-size: 10px;
    margin: 5px 0;

    .label {
      display: flex;
      align-items: center;
      text-transform: capitalize;

      .icon {
        margin-right: 5px;
      }
    }

    .value {
      height: 10px;
      text-align: right;
      margin-left: 17px;

      &::before {
        content: '\00a0';
        visibility: hidden;
      }
    }

    &.light-mode {
      .label {
        color: $card-text-color-LM;
      }

      .value {
        color: $section-title-color-LM;
      }
    }
  }
}

</style>