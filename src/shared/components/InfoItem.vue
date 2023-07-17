<template>
<div class="info-item">
  <div class="item-icon">
    <img :src="icon" alt="" >
  </div>
  <div class="info-title">{{ title }}</div>
  <div class="info-data">{{ data }}</div>
</div>
</template>

<script setup>
const props = defineProps({
  title: String,
  data: String,
  icon: String,
})

</script>

<style lang="scss">
@import "@/assets/scss/_variables";

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid $btn-border-grey;
  border-radius: 10px;
  padding: 33px 15px 10px;
  background-color: $dark-grey;
  font-family: $semi-bold;

  .item-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid $btn-border-grey;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -25px;
    background-color: $lighter-grey;
  }

  .info-title {
    font-size: 16px;
    color: $body-text-color;
  }

  .info-data {
    font-size: 24px;
    color: $text-color-white;
    font-family: $mainFont;
  }
}

@media screen and (max-width: $tableWidth) {
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border: 1px solid $btn-border-grey;
    border-radius: 10px;
    padding: 33px 15px 10px;
    background-color: $dark-grey;
    font-family: $semi-bold;

    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid $btn-border-grey;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -20px;
      background-color: $lighter-grey;
    }

    .info-title {
      font-size: 16px;
      color: $body-text-color;
    }

    .info-data {
      font-weight: 700;
      font-size: 22px;
      line-height: 17px;
      color: $text-color-white;
    }
  }
}
</style>