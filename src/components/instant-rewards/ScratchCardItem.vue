<template>
  <div class="scratch-card-item">
    <div class="scratch-card-item__icon">
      <img :src="icon" alt="">
    </div>
    <div class="scratch-card-item__data">
      <span class="scratch-card-item__data__title">{{ title }}</span>
      <span class="scratch-card-item__data__price">${{ price }}</span>
      <span class="scratch-card-item__data__date">{{ date }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScratchCardItem',
  props: {
    title: String,
    icon: String,
    price: String,
    date: String
  }
};
</script>

<style lang="scss">
.scratch-card-item {
  display: flex;
  padding: 14px 0;

  &__icon {
    width: 71px;
    height: 71px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #5D53C2;
    border-radius: 10px;

    & > img {
      width: 90%;
      height: 90%;
    }
  }

  &__data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 18px;

    &__title {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #455A64;
    }

    &__price {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 20px;
      line-height: 30px;
      color: #5D53C2;
    }

    &__date {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 20px;
      color: #AAA4BE;
    }
  }
}
</style>