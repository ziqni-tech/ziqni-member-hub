<template>
  <div class="loyality-store-card">
    <div class="loyality-store-card__header">
      <div class="loyality-store-card__header_title">
        <span class="loyality-store-card__header_title_name">Model</span>
        <span class="loyality-store-card__header_title_type">Type</span>
      </div>
      <div class="loyality-store-card__header_price">$400/d</div>
    </div>
    <div class="loyality-store-card__img">
      <img src="../assets/images/car-audi.png" alt="">
    </div>
    <div class="loyality-store-card__footer">
      <button class="s-btn" @click="toBuy">
        <span class="b-btn__text">Buy</span>
      </button>
    </div>
  </div>
</template>

<script setup>

const toBuy = () => {
  console.log('BUY')
}
</script>

<style scoped lang="scss">
.loyality-store-card {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  padding: 24px;
  background: #FFFFFF;
  border-radius: 16px;
  font-family: 'Poppins', sans-serif;

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    &_title {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;

      &_name {
        font-style: normal;
        font-weight: 700;
        font-size: 18px;
        line-height: 23px;
        color: #242731;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &_type {
        max-width: 200px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 21px;
        color: #72767C;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &__img {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0 18px;
  }

  &__footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>