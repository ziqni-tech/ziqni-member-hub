<template>
  <div class="model-spend">
    <div class="model-spend__icon">
      <img :src="icon" alt="">
    </div>
    <div class="model-spend__price">${{ price }}</div>
    <span class="model-spend__title">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'ModelSpend',
  props: {
    icon: String,
    price: String,
    title: String
  }
};
</script>

<style lang="scss">
.model-spend {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(64, 126, 249, 0.1);
    border-radius: 8px;

    & > img {
      width: inherit;
      height: inherit;
    }
  }

  &__price {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    color: #407EF9;
    text-align: start;
  }

  &__title {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    color: #808191;
    padding-top: 5px;
  }
}
</style>