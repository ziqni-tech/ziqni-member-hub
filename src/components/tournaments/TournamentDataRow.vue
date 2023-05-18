<template>
  <div class="data-row">
    <div class="label">
      <div class="icon">
        <img :src="icon" alt="">
      </div>
      {{ label }}
    </div>
    <div class="value">
      {{ isDate ? countdownResult : value }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: String,
  label: String,
  value: String,
  isDate: Boolean
})
import { useCountdown } from '@/hooks/useCountdown';

const countdownResult = useCountdown(props.value);

</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.data-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  margin-top: 10px;

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
    text-align: right;
    color: $main-text-color-white;
  }
}


</style>