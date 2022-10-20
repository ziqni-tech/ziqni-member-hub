<template>
  <div class="info-wrapper">
    <div
      class="info"
      v-for="(item, index) in items"
      :key="index"
    >
      <CCardText class="info-title">{{ item.title }}</CCardText>
      <CCardText class="info-value">{{ item.value }}</CCardText>
    </div>
  </div>
</template>

<script>
import { CCardText } from '@coreui/vue'
export default {
  name: 'TotalInfoItems',
  components: {
    CCardText
  },
  props: {
    items: Array
  }
};
</script>

<style lang="scss">
@import 'src/assets/scss/_variables.scss';

.info-wrapper {
  display: flex;
  flex-wrap: wrap;

  .info {
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
    margin-top: 28px;
    text-align: start;

    &:nth-child(odd) {
      border-right: 1px solid $total-info-card-info-item-border-color;
    }

    &:nth-child(even) {
      border-left: 1px solid $total-info-card-info-item-border-color;
      padding-left: 30px;
    }

    .info-title {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      color: $total-info-card-info-item-title-color;
    }
    .info-value {
      font-family: 'Montserrat';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
      color: $text-white;
    }
  }
}
</style>