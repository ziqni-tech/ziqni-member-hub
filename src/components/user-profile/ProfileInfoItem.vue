<template>
<div class="profile-info-item">
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
@import "src/assets/scss/_variables";

.profile-info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border: 1px solid $border-dark;
  border-radius: 10px;
  padding: 33px 15px 10px;
  background-color: $dark-grey;

  .item-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid $border-dark;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: -25px;
    background-color: $light-grey;
  }

  .info-title {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    color: $body-text-color;
  }

  .info-data {
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    color: $main-text-color-white;
  }
}
</style>