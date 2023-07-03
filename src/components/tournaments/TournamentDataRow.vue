<template>
  <div class="data-row">
    <div class="label">
      <div class="icon">
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
  isDate: Boolean
});
import { useCountdown } from '@/hooks/useCountdown';

const countdownResult = useCountdown(props.value);
const date = ref('');

watch(countdownResult, (value) => {
  if (value) {
    const { days, hours, minutes, seconds, expired } = value;
    date.value = `${ days }d ${ hours }h ${ minutes }m ${ seconds }s`;
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
  font-family: $bold;
  font-size: 12px;
  margin-top: 10px;

  .label {
    display: flex;
    align-items: center;
    text-transform: capitalize;
    color: $body-text-color;

    .icon {
      margin-right: 5px;
      > img {
        margin-bottom: 10px;
      }
    }
  }

  .value {
    text-align: right;
    color: $text-color-white;
  }
}

@media screen and (max-width: $tableWidth) {
  .data-row {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    margin: 5px 0;

    .label {
      display: flex;
      align-items: center;
      text-transform: capitalize;
      color: $body-text-color;

      .icon {
        margin-right: 5px;
      }
    }

    .value {
      height: 10px;
      text-align: right;
      padding-left: 20px;
      color: $text-color-white;
    }
  }
}

</style>